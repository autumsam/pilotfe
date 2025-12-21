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

export interface AIInsight {
  id: string;
  type: 'timing' | 'hashtag' | 'content' | 'engagement' | 'audience';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  action?: string;
}

export interface PostAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  topics: string[];
  hashtags: string[];
  mentions: string[];
  engagement_prediction: number;
  best_time_to_post?: string;
  suggestions: string[];
}

export interface ContentGenerationRequest {
  topic?: string;
  platform?: string;
  tone?: 'professional' | 'casual' | 'humorous' | 'informative';
  length?: 'short' | 'medium' | 'long';
  keywords?: string[];
}

export interface HashtagSuggestion {
  hashtag: string;
  relevance: number;
  popularity: number;
  competition: 'low' | 'medium' | 'high';
}

class AIApiService {
  // Get AI insights for user's content
  async getInsights(params?: {
    platform?: string;
    timeframe?: 'day' | 'week' | 'month' | 'year';
    limit?: number;
  }): Promise<AIInsight[]> {
    const queryParams = new URLSearchParams();
    if (params?.platform) queryParams.append('platform', params.platform);
    if (params?.timeframe) queryParams.append('timeframe', params.timeframe);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiCall<AIInsight[]>(`/api/ai/insights/${query}`);
  }

  // Analyze a post or post draft
  async analyzePost(content: string, platform?: string): Promise<PostAnalysis> {
    return apiCall<PostAnalysis>('/api/ai/analyze/', 'POST', {
      content,
      platform,
    });
  }

  // Generate content using AI
  async generateContent(request: ContentGenerationRequest): Promise<{ content: string; variants: string[] }> {
    return apiCall<{ content: string; variants: string[] }>('/api/ai/generate/', 'POST', request);
  }

  // Get hashtag suggestions
  async suggestHashtags(content: string, platform?: string): Promise<HashtagSuggestion[]> {
    return apiCall<HashtagSuggestion[]>('/api/ai/hashtags/', 'POST', {
      content,
      platform,
    });
  }

  // Get optimal posting times based on AI analysis
  async getOptimalTimes(platform?: string): Promise<{
    times: Array<{ day: string; hour: number; score: number }>;
    recommendation: string;
  }> {
    const queryParams = platform ? `?platform=${platform}` : '';
    return apiCall<any>(`/api/ai/optimal-times/${queryParams}`);
  }

  // Adjust tone of content
  async adjustTone(
    content: string,
    targetTone: 'professional' | 'casual' | 'humorous' | 'informative'
  ): Promise<{ original: string; adjusted: string }> {
    return apiCall<{ original: string; adjusted: string }>('/api/ai/adjust-tone/', 'POST', {
      content,
      target_tone: targetTone,
    });
  }

  // Generate image captions
  async generateImageCaption(imageUrl: string, context?: string): Promise<{ caption: string; hashtags: string[] }> {
    return apiCall<{ caption: string; hashtags: string[] }>('/api/ai/image-caption/', 'POST', {
      image_url: imageUrl,
      context,
    });
  }

  // Get AI usage statistics
  async getUsageStats(): Promise<{
    total_requests: number;
    tokens_used: number;
    features_used: Record<string, number>;
    cost_estimate: number;
  }> {
    return apiCall<any>('/api/ai/usage/stats/');
  }

  // Check if AI features are available (API keys configured)
  async checkAvailability(): Promise<{
    available: boolean;
    provider: string | null;
    features: string[];
  }> {
    try {
      return await apiCall<any>('/api/ai/availability/');
    } catch (error) {
      return {
        available: false,
        provider: null,
        features: [],
      };
    }
  }
}

export const aiApi = new AIApiService();
