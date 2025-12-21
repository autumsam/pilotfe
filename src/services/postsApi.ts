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

// Post Types
export interface Post {
  id: number;
  uuid: string;
  user: number;
  user_id: number;
  user_email: string;
  content: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  is_ai_generated: boolean;
  ai_prompt?: string;
  hashtags: string[];
  mentions: string[];
  scheduled_at?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  edit_count: number;
  last_edited_at?: string;
  media?: PostMedia[];
  platforms?: PostPlatform[];
}

export interface PostMedia {
  id: number;
  media_type: 'image' | 'video' | 'audio' | 'gif';
  url: string;
  thumbnail_url?: string;
  alt_text?: string;
  file_size?: number;
  duration_seconds?: number;
  width?: number;
  height?: number;
  sort_order: number;
  created_at: string;
}

export interface PostPlatform {
  id: number;
  platform: 'twitter' | 'instagram' | 'facebook' | 'linkedin' | 'tiktok';
  connection?: number;
  platform_content?: string;
  platform_post_id?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  published_at?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePostRequest {
  content: string;
  status?: 'draft' | 'scheduled' | 'published';
  is_ai_generated?: boolean;
  ai_prompt?: string;
  hashtags?: string[];
  mentions?: string[];
  scheduled_at?: string;
  platforms?: string[];
}

export interface UpdatePostRequest {
  content?: string;
  status?: 'draft' | 'scheduled' | 'published';
  hashtags?: string[];
  mentions?: string[];
  scheduled_at?: string;
}

export interface OptimalTime {
  day: string;
  hour: number;
  score: number;
}

class PostsApiService {
  // ============ Post CRUD Operations ============

  /**
   * Get all posts for the current user (secure - user can only see their own)
   */
  async getAllPosts(params?: {
    status?: string;
    search?: string;
    ordering?: string;
  }): Promise<Post[]> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiCall<Post[]>(`/api/posts/${query}`);
  }

  /**
   * Get a specific post by UUID (secure - user can only access their own)
   */
  async getPost(uuid: string): Promise<Post> {
    return apiCall<Post>(`/api/posts/${uuid}/`);
  }

  /**
   * Create a new post
   */
  async createPost(data: CreatePostRequest): Promise<Post> {
    return apiCall<Post>('/api/posts/', 'POST', data);
  }

  /**
   * Update an existing post (can only edit own posts in draft/scheduled status)
   */
  async updatePost(uuid: string, data: UpdatePostRequest): Promise<Post> {
    return apiCall<Post>(`/api/posts/${uuid}/`, 'PATCH', data);
  }

  /**
   * Delete a post
   */
  async deletePost(uuid: string): Promise<void> {
    return apiCall<void>(`/api/posts/${uuid}/`, 'DELETE');
  }

  // ============ Status-Specific Endpoints ============

  /**
   * Get all draft posts
   */
  async getDrafts(): Promise<Post[]> {
    return apiCall<Post[]>('/api/posts/drafts/');
  }

  /**
   * Get all scheduled posts
   */
  async getScheduled(): Promise<Post[]> {
    return apiCall<Post[]>('/api/posts/scheduled/');
  }

  /**
   * Get all published posts
   */
  async getPublished(): Promise<Post[]> {
    return apiCall<Post[]>('/api/posts/published/');
  }

  // ============ Post Actions ============

  /**
   * Publish a post immediately
   */
  async publishPost(uuid: string): Promise<Post> {
    return apiCall<Post>(`/api/posts/${uuid}/publish/`, 'POST');
  }

  /**
   * Schedule a post for later
   */
  async schedulePost(uuid: string, scheduledAt: string): Promise<Post> {
    return apiCall<Post>(`/api/posts/${uuid}/schedule/`, 'POST', {
      scheduled_at: scheduledAt
    });
  }

  /**
   * Duplicate a post (creates a new draft copy)
   */
  async duplicatePost(uuid: string): Promise<Post> {
    return apiCall<Post>(`/api/posts/${uuid}/duplicate/`, 'POST');
  }

  // ============ Media Management ============

  /**
   * Add media to a post
   */
  async addMedia(postId: number, mediaData: Partial<PostMedia>): Promise<PostMedia> {
    return apiCall<PostMedia>('/api/posts/media/', 'POST', {
      ...mediaData,
      post: postId
    });
  }

  /**
   * Update media
   */
  async updateMedia(mediaId: number, mediaData: Partial<PostMedia>): Promise<PostMedia> {
    return apiCall<PostMedia>(`/api/posts/media/${mediaId}/`, 'PATCH', mediaData);
  }

  /**
   * Delete media
   */
  async deleteMedia(mediaId: number): Promise<void> {
    return apiCall<void>(`/api/posts/media/${mediaId}/`, 'DELETE');
  }

  // ============ Platform-Specific Operations ============

  /**
   * Get platform-specific post versions
   */
  async getPlatformPosts(postId: number): Promise<PostPlatform[]> {
    return apiCall<PostPlatform[]>(`/api/posts/platforms/?post=${postId}`);
  }

  // ============ Scheduling & Optimal Times ============

  /**
   * Get optimal posting times
   */
  async getOptimalTimes(platform?: string): Promise<{
    times: OptimalTime[];
    recommendation: string;
  }> {
    const query = platform ? `?platform=${platform}` : '';
    return apiCall<any>(`/api/optimal-times/${query}`);
  }

  /**
   * Get schedule queue
   */
  async getScheduleQueue(status?: string): Promise<any[]> {
    const query = status ? `?status=${status}` : '';
    return apiCall<any[]>(`/api/schedule-queue/${query}`);
  }
}

export const postsApi = new PostsApiService();
export default postsApi;

