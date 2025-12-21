import authService from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://pilotbe.onrender.com';

// Helper function to get CSRF token from cookies
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// Helper function to make authenticated API calls
async function apiCall<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  body?: any
): Promise<T> {
  const token = authService.getToken();
  
  if (!token) {
    throw new Error('Not authenticated');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };

  // Add CSRF token for state-changing methods
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || error.message || 'Request failed');
  }

  return response.json();
}

export interface SocialConnection {
  id: number;
  platform: 'twitter' | 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'threads';
  platform_user_id: string;
  platform_username: string;
  access_token: string;
  refresh_token?: string;
  token_expires_at?: string;
  profile_url: string;
  followers_count: number;
  is_active: boolean;
  last_synced_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ConnectSocialAccountRequest {
  platform: string;
  access_token: string;
  refresh_token?: string;
  platform_user_id: string;
  platform_username: string;
  token_expires_at?: string;
}

class SocialConnectionsApiService {
  // Get all connected accounts for current user
  async getConnectedAccounts(): Promise<SocialConnection[]> {
    const response = await apiCall<any>('/api/social-connections/');
    
    // Handle paginated response
    if (response && typeof response === 'object' && 'results' in response) {
      return response.results as SocialConnection[];
    }
    
    return response as SocialConnection[];
  }

  // Connect a new social account
  async connectAccount(data: ConnectSocialAccountRequest): Promise<SocialConnection> {
    return apiCall<SocialConnection>('/api/social-connections/', 'POST', data);
  }

  // Disconnect a social account
  async disconnectAccount(connectionId: number): Promise<void> {
    return apiCall<void>(`/api/social-connections/${connectionId}/`, 'DELETE');
  }

  // Refresh access token for a connection
  async refreshConnection(connectionId: number): Promise<SocialConnection> {
    return apiCall<SocialConnection>(`/api/social-connections/${connectionId}/refresh/`, 'POST');
  }

  // Sync data from social platform
  async syncConnection(connectionId: number): Promise<SocialConnection> {
    return apiCall<SocialConnection>(`/api/social-connections/${connectionId}/sync/`, 'POST');
  }

  // Manually fetch data from platform (debugging/testing)
  async fetchConnectionData(connectionId: number): Promise<{
    success: boolean;
    message: string;
    connection: SocialConnection;
  }> {
    return apiCall<any>(`/api/social-connections/${connectionId}/fetch_data/`, 'POST');
  }

  // Get OAuth authorization URL
  async getOAuthUrl(platform: string): Promise<string> {
    const redirectUri = `${window.location.origin}/auth/callback/${platform}`;
    const state = Math.random().toString(36).substring(7);
    
    // Store state in session storage for verification
    sessionStorage.setItem('oauth_state', state);
    sessionStorage.setItem('oauth_platform', platform);
    
    try {
      // Request OAuth URL from backend (includes code_verifier for PKCE)
      const response = await apiCall<{ 
        authorization_url: string;
        code_verifier?: string; 
      }>(
        `/api/social-connections/oauth/?platform=${platform}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`
      );
      
      // Store code_verifier for PKCE (Twitter uses this)
      if (response.code_verifier) {
        sessionStorage.setItem('oauth_code_verifier', response.code_verifier);
      }
      
      return response.authorization_url;
    } catch (error) {
      console.error('Error getting OAuth URL:', error);
      throw error;
    }
  }

  // Handle OAuth callback
  async handleOAuthCallback(platform: string, code: string, state: string): Promise<SocialConnection> {
    const storedState = sessionStorage.getItem('oauth_state');
    
    if (state !== storedState) {
      throw new Error('Invalid OAuth state');
    }
    
    const redirectUri = `${window.location.origin}/auth/callback/${platform}`;
    const codeVerifier = sessionStorage.getItem('oauth_code_verifier');
    
    const requestData: any = {
      platform,
      code,
      redirect_uri: redirectUri,
    };

    // Add code_verifier for platforms that use PKCE (like Twitter)
    if (codeVerifier) {
      requestData.code_verifier = codeVerifier;
    }
    
    const connection = await apiCall<SocialConnection>('/api/social-connections/oauth/callback/', 'POST', requestData);
    
    // Clear stored OAuth data
    sessionStorage.removeItem('oauth_state');
    sessionStorage.removeItem('oauth_platform');
    sessionStorage.removeItem('oauth_code_verifier');
    
    return connection;
  }

  // Get platform-specific data (posts, analytics, etc.)
  async getPlatformPosts(connectionId: number, params?: {
    limit?: number;
    since?: string;
    until?: string;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.since) queryParams.append('since', params.since);
    if (params?.until) queryParams.append('until', params.until);
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiCall<any>(`/api/social-connections/${connectionId}/posts/${query}`);
  }

  // Get recent posts from all connected platforms
  async getRecentPosts(): Promise<{
    posts: Array<{
      id: number;
      content: string;
      platform: string;
      platform_post_id: string;
      platform_username: string;
      hashtags: string[];
      mentions: string[];
      published_at: string;
      analytics?: {
        impressions: number;
        engagements: number;
        likes: number;
        comments: number;
        shares: number;
        engagement_rate: number;
      };
    }>;
    count: number;
  }> {
    return apiCall<any>('/api/social-connections/recent_posts/');
  }

  // Get platform analytics
  async getPlatformAnalytics(connectionId: number, params?: {
    period?: 'day' | 'week' | 'month';
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.period) queryParams.append('period', params.period);
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiCall<any>(`/api/social-connections/${connectionId}/analytics/${query}`);
  }

  // Mask API key/token (show only last 4 characters)
  maskToken(token: string): string {
    if (!token || token.length <= 4) return '****';
    return '****' + token.slice(-4);
  }
}

export const socialConnectionsApi = new SocialConnectionsApiService();
