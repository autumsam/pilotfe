import authService from './auth';

export interface SystemSetting {
  id: number;
  key: string;
  value: any;
  description: string;
  category: string;
  updated_by: number;
  updated_by_email: string;
  created_at: string;
  updated_at: string;
}

export interface SystemSettingsData {
  [key: string]: any;
}

export interface APIKey {
  id: number;
  platform: string;
  platform_display: string;
  platform_display_name?: string;
  field_type: string;
  field_type_display: string;
  field_name: string;
  masked_value: string;
  model_name?: string;
  description?: string;
  is_active: boolean;
  is_default_ai?: boolean;
  created_by?: number;
  created_by_email?: string;
  updated_by?: number;
  updated_by_email?: string;
  created_at: string;
  updated_at: string;
}

export interface APIKeyCreate {
  platform: string;
  platform_display_name?: string;
  field_type: string;
  field_name?: string;
  value: string;
  model_name?: string;
  description?: string;
  is_active?: boolean;
  is_default_ai?: boolean;
}

export interface Platform {
  value: string;
  label: string;
  configured: boolean;
}

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

class AdminApiService {
  // System Settings
  async getSystemSettings(): Promise<SystemSetting[]> {
    return apiCall<SystemSetting[]>('/api/admin/settings/');
  }

  async updateSystemSetting(key: string, value: any, description?: string, category?: string): Promise<SystemSetting> {
    // First try to find existing setting
    const existing = await this.getSystemSettings();
    const existingSetting = existing.find(s => s.key === key);

    const data = {
      key,
      value,
      description: description || '',
      category: category || 'api_keys'
    };

    if (existingSetting) {
      return apiCall<SystemSetting>(`/api/admin/settings/${existingSetting.id}/`, 'PUT', data);
    } else {
      return apiCall<SystemSetting>('/api/admin/settings/', 'POST', data);
    }
  }

  async updateMultipleSettings(settings: SystemSettingsData): Promise<SystemSetting[]> {
    const promises = Object.entries(settings).map(([key, value]) =>
      this.updateSystemSetting(key, value)
    );
    return Promise.all(promises);
  }

  async deleteSystemSetting(key: string): Promise<void> {
    const existing = await this.getSystemSettings();
    const setting = existing.find(s => s.key === key);
    if (setting) {
      await apiCall<void>(`/api/admin/settings/${setting.id}/`, 'DELETE');
    }
  }

  // API Keys specific methods
  async saveApiKeys(apiKeys: {
    twitter_api_key?: string;
    twitter_api_secret?: string;
    facebook_app_id?: string;
    facebook_app_secret?: string;
    instagram_access_token?: string;
    instagram_client_secret?: string;
    threads_app_id?: string;
    threads_app_secret?: string;
    tiktok_app_key?: string;
    tiktok_app_secret?: string;
    linkedin_client_id?: string;
    linkedin_client_secret?: string;
    openai_api_key?: string;
    openai_org_id?: string;
    anthropic_api_key?: string;
    anthropic_model?: string;
    gemini_api_key?: string;
    gemini_project_id?: string;
  }): Promise<SystemSetting[]> {
    const filteredKeys = Object.fromEntries(
      Object.entries(apiKeys).filter(([_, value]) => value && value.trim() !== '')
    );
    return this.updateMultipleSettings(filteredKeys);
  }

  async getApiKeys(): Promise<SystemSettingsData> {
    try {
      const response = await this.getSystemSettings();
      
      // Handle both array and paginated response
      let settings: SystemSetting[] = [];
      if (Array.isArray(response)) {
        settings = response;
      } else if (response && typeof response === 'object' && 'results' in response) {
        settings = (response as any).results;
      } else {
        console.warn('Unexpected settings format:', response);
        return {};
      }
      
      const apiKeySettings = settings.filter(s =>
        s.category === 'api_keys' ||
        ['twitter', 'facebook', 'instagram', 'linkedin', 'tiktok', 'threads', 'openai', 'anthropic', 'gemini'].some(platform =>
          s.key.toLowerCase().includes(platform)
        )
      );

      return apiKeySettings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as SystemSettingsData);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      return {};
    }
  }

  // New encrypted API Key methods
  async getAllAPIKeys(): Promise<APIKey[]> {
    const response = await apiCall<any>('/api/admin/api-keys/');
    
    // Handle paginated response
    if (response && typeof response === 'object' && 'results' in response) {
      return response.results as APIKey[];
    }
    
    return response as APIKey[];
  }

  async getAPIKeysByPlatform(platform: string): Promise<APIKey[]> {
    return apiCall<APIKey[]>(`/api/admin/api-keys/by_platform/?platform=${platform}`);
  }

  async createAPIKey(data: APIKeyCreate): Promise<APIKey> {
    return apiCall<APIKey>('/api/admin/api-keys/', 'POST', data);
  }

  async updateAPIKey(id: number, data: Partial<APIKeyCreate>): Promise<APIKey> {
    return apiCall<APIKey>(`/api/admin/api-keys/${id}/`, 'PATCH', data);
  }

  async deleteAPIKey(id: number): Promise<void> {
    return apiCall<void>(`/api/admin/api-keys/${id}/`, 'DELETE');
  }

  async bulkCreateAPIKeys(keys: APIKeyCreate[]): Promise<{
    created: APIKey[];
    errors: any[];
    total_created: number;
    total_errors: number;
  }> {
    return apiCall('/api/admin/api-keys/bulk_create/', 'POST', { keys });
  }

  async getAvailablePlatforms(): Promise<Platform[]> {
    return apiCall<Platform[]>('/api/admin/api-keys/platforms/');
  }

  async decryptAPIKey(id: number): Promise<{ id: number; field_name: string; value: string; masked_value: string }> {
    return apiCall(`/api/admin/api-keys/${id}/decrypt/`);
  }
}

export const adminApi = new AdminApiService();
