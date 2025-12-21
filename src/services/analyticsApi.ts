import authService from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://pilotbe.onrender.com';

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

interface AnalyticsSummary {
  total_impressions: number;
  total_engagements: number;
  total_reach: number;
  avg_engagement_rate: number;
}

interface PlatformAnalytics {
  platform: string;
  total_impressions: number;
  total_engagements: number;
  total_reach: number;
  avg_engagement_rate: number;
}

interface DailyAnalytic {
  id: number;
  user: number;
  platform: string;
  date: string;
  followers_count: number;
  followers_gained: number;
  followers_lost: number;
  posts_count: number;
  total_impressions: number;
  total_engagements: number;
  total_reach: number;
  avg_engagement_rate: number;
  created_at: string;
}

class AnalyticsApiService {
  // Get analytics summary
  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    return apiCall<AnalyticsSummary>('/api/analytics/posts/summary/');
  }

  // Get analytics by platform
  async getAnalyticsByPlatform(): Promise<PlatformAnalytics[]> {
    return apiCall<PlatformAnalytics[]>('/api/analytics/posts/by_platform/');
  }

  // Get daily analytics
  async getDailyAnalytics(platform?: string, startDate?: string, endDate?: string): Promise<DailyAnalytic[]> {
    const params = new URLSearchParams();
    if (platform) params.append('platform', platform);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await apiCall<any>(`/api/analytics/daily/${query}`);
    
    // Handle paginated response
    if (response && typeof response === 'object' && 'results' in response) {
      return response.results as DailyAnalytic[];
    }
    
    return response as DailyAnalytic[];
  }

  // Get daily analytics by platform
  async getDailyAnalyticsByPlatform(platform: string, startDate?: string, endDate?: string): Promise<DailyAnalytic[]> {
    const params = new URLSearchParams();
    params.append('platform', platform);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const query = params.toString();
    return apiCall<DailyAnalytic[]>(`/api/analytics/daily/by_platform/?${query}`);
  }
}

export const analyticsApi = new AnalyticsApiService();
export type { AnalyticsSummary, PlatformAnalytics, DailyAnalytic };
