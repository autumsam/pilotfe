import authService from './auth';
import type {
  User,
  UserProfile,
  UserPreferences,
  UserDetail,
  UpdateUserRequest,
  UpdateProfileRequest,
  UpdatePreferencesRequest,
  ChangePasswordRequest,
  AdminUserUpdateRequest,
} from '@/types/user';
import type {
  UserStats,
  UserDetailedInfo,
  Subscription,
} from '@/types/subscription';

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

const userApi = {
  // ============ Current User Operations ============

  /**
   * Get current user's detailed profile
   */
  async getCurrentUser(): Promise<UserDetail> {
    return apiCall<UserDetail>('/api/users/me/');
  },

  /**
   * Update current user's basic info
   */
  async updateCurrentUser(data: UpdateUserRequest): Promise<UserDetail> {
    return apiCall<UserDetail>('/api/users/update_me/', 'PATCH', data);
  },

  /**
   * Get current user's profile
   */
  async getCurrentProfile(): Promise<UserProfile> {
    return apiCall<UserProfile>('/api/profiles/me/');
  },

  /**
   * Update current user's profile
   */
  async updateCurrentProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    // First get the profile to get the ID
    const profile = await this.getCurrentProfile();
    return apiCall<UserProfile>(`/api/profiles/${profile.id}/`, 'PATCH', data);
  },

  /**
   * Get current user's preferences
   */
  async getCurrentPreferences(): Promise<UserPreferences> {
    return apiCall<UserPreferences>('/api/preferences/me/');
  },

  /**
   * Update current user's preferences
   */
  async updateCurrentPreferences(data: UpdatePreferencesRequest): Promise<UserPreferences> {
    // First get the preferences to get the ID
    const prefs = await this.getCurrentPreferences();
    return apiCall<UserPreferences>(`/api/preferences/${prefs.id}/`, 'PATCH', data);
  },

  /**
   * Change current user's password
   */
  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    // We'll need to add this endpoint in the backend
    return apiCall<{ message: string }>('/api/users/change_password/', 'POST', data);
  },

  // ============ Admin User Management Operations ============

  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<User[]> {
    const response = await apiCall<any>('/api/users/');
    
    // Handle paginated response from DRF
    if (response && typeof response === 'object' && 'results' in response) {
      return response.results as User[];
    }
    
    // If it's already an array, return as is
    return response as User[];
  },

  /**
   * Get a specific user by ID (admin only)
   */
  async getUser(userId: number): Promise<UserDetail> {
    return apiCall<UserDetail>(`/api/users/${userId}/`);
  },

  /**
   * Create a new user (admin only)
   */
  async createUser(data: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    role?: 'admin' | 'moderator' | 'user';
  }): Promise<User> {
    const user = await apiCall<User>('/api/users/', 'POST', {
      username: data.username,
      email: data.email,
      password: data.password,
      password2: data.password, // Backend requires password confirmation
      first_name: data.first_name,
      last_name: data.last_name,
    });

    // If role is specified and not 'user', update the role
    if (data.role && data.role !== 'user') {
      await this.updateUserRole(user.id, data.role);
    }

    return user;
  },

  /**
   * Update user (admin only)
   */
  async updateUser(userId: number, data: UpdateUserRequest): Promise<User> {
    return apiCall<User>(`/api/users/${userId}/`, 'PATCH', data);
  },

  /**
   * Delete user (admin only)
   */
  async deleteUser(userId: number): Promise<void> {
    return apiCall<void>(`/api/users/${userId}/`, 'DELETE');
  },

  /**
   * Suspend user (admin only)
   */
  async suspendUser(userId: number): Promise<UserDetail> {
    // Update user's is_active status and profile status
    await apiCall<User>(`/api/users/${userId}/`, 'PATCH', { is_active: false });
    
    // Also update profile status
    const user = await this.getUser(userId);
    await apiCall<UserProfile>(`/api/profiles/${user.profile.id}/`, 'PATCH', { status: 'suspended' });
    
    return this.getUser(userId);
  },

  /**
   * Activate user (admin only)
   */
  async activateUser(userId: number): Promise<UserDetail> {
    // Update user's is_active status and profile status
    await apiCall<User>(`/api/users/${userId}/`, 'PATCH', { is_active: true });
    
    // Also update profile status
    const user = await this.getUser(userId);
    await apiCall<UserProfile>(`/api/profiles/${user.profile.id}/`, 'PATCH', { status: 'active' });
    
    return this.getUser(userId);
  },

  /**
   * Update user role (admin only)
   */
  async updateUserRole(userId: number, role: 'admin' | 'moderator' | 'user'): Promise<void> {
    // First, get the user's role record
    const user = await this.getUser(userId);
    
    if (user.role && user.role.id) {
      // Update existing role
      await apiCall(`/api/roles/${user.role.id}/`, 'PATCH', { role });
    } else {
      // Create new role
      await apiCall('/api/roles/', 'POST', { user: userId, role });
    }

    // Also update is_staff based on role
    const isStaff = role === 'admin';
    await apiCall(`/api/users/${userId}/`, 'PATCH', { is_staff: isStaff });
  },

  /**
   * Get all user profiles (admin only)
   */
  async getAllProfiles(): Promise<UserProfile[]> {
    return apiCall<UserProfile[]>('/api/profiles/');
  },

  /**
   * Bulk update users (admin only)
   */
  async bulkUpdateUsers(
    userIds: number[],
    action: 'suspend' | 'activate' | 'delete'
  ): Promise<void> {
    const promises = userIds.map((userId) => {
      switch (action) {
        case 'suspend':
          return this.suspendUser(userId);
        case 'activate':
          return this.activateUser(userId);
        case 'delete':
          return this.deleteUser(userId);
        default:
          return Promise.resolve();
      }
    });

    await Promise.all(promises);
  },

  // ============ Statistics and Detailed Info ============

  /**
   * Get user statistics (admin only)
   */
  async getUserStats(): Promise<UserStats> {
    return apiCall<UserStats>('/api/users/stats/');
  },

  /**
   * Get detailed info for a user (admin only)
   */
  async getUserDetailedInfo(userId: number): Promise<UserDetailedInfo> {
    return apiCall<UserDetailedInfo>(`/api/users/${userId}/detailed_info/`);
  },

  /**
   * Change user subscription tier (admin only)
   */
  async changeUserSubscription(
    userId: number,
    tier: 'free' | 'starter' | 'professional' | 'enterprise'
  ): Promise<Subscription> {
    // First get the user to find their subscription
    const user = await this.getUser(userId);
    
    // Get subscription ID from detailed info
    const detailedInfo = await this.getUserDetailedInfo(userId);
    const subscriptionId = detailedInfo.subscription?.id;
    
    if (!subscriptionId) {
      throw new Error('User does not have a subscription');
    }
    
    return apiCall<Subscription>(`/api/subscriptions/${subscriptionId}/change_tier/`, 'POST', { tier });
  },
};

export default userApi;

