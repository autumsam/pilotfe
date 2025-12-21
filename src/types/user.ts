// User-related TypeScript types and interfaces

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
}

export interface UserProfile {
  id: number;
  user: number;
  email: string;
  full_name: string;
  username: string;
  avatar_url: string;
  bio: string;
  website: string;
  timezone: string;
  language: string;
  status: 'active' | 'suspended' | 'inactive';
  last_active: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: number;
  user: number;
  user_email: string;
  role: 'admin' | 'moderator' | 'user';
  assigned_by: number | null;
  assigned_at: string;
}

export interface UserPreferences {
  id: number;
  user: number;
  theme: 'light' | 'dark' | 'system';
  email_notifications: boolean;
  push_notifications: boolean;
  weekly_digest: boolean;
  auto_schedule: boolean;
  default_platforms: string[];
  created_at: string;
  updated_at: string;
}

export interface UserDetail {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  profile: UserProfile;
  role: UserRole;
  preferences: UserPreferences;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

export interface UpdateProfileRequest {
  full_name?: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  timezone?: string;
  language?: string;
}

export interface UpdatePreferencesRequest {
  theme?: 'light' | 'dark' | 'system';
  email_notifications?: boolean;
  push_notifications?: boolean;
  weekly_digest?: boolean;
  auto_schedule?: boolean;
  default_platforms?: string[];
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface AdminUserUpdateRequest {
  is_active?: boolean;
  is_staff?: boolean;
  role?: 'admin' | 'moderator' | 'user';
  status?: 'active' | 'suspended' | 'inactive';
}

