// Subscription-related TypeScript types

export interface PlanLimits {
  id: number;
  tier: 'free' | 'starter' | 'professional' | 'enterprise';
  posts_per_month: number;
  scheduled_posts: number;
  social_accounts: number;
  ai_generations_per_month: number;
  team_members: number;
  analytics_retention_days: number;
  has_api_access: boolean;
  has_priority_support: boolean;
  price_monthly: string | null;
  price_yearly: string | null;
  created_at: string;
}

export interface Subscription {
  id: number;
  user: number;
  user_email: string;
  tier: 'free' | 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  stripe_customer_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  trial_end: string | null;
  plan_limits?: PlanLimits;
  created_at: string;
  updated_at: string;
}

export interface SocialConnection {
  id: number;
  platform: 'twitter' | 'instagram' | 'facebook' | 'linkedin' | 'tiktok';
  platform_user_id: string;
  platform_username: string;
  profile_url: string;
  followers_count: number;
  is_active: boolean;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AIUsage {
  id: number;
  feature: 'content_generation' | 'hashtag_suggestion' | 'optimal_time' | 'tone_adjustment' | 'image_caption';
  tokens_used: number;
  success: boolean;
  created_at: string;
}

export interface APIUsageLog {
  id: number;
  endpoint: string;
  method: string;
  platform: string;
  status_code: number;
  response_time_ms: number;
  created_at: string;
}

export interface UserStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  suspended_users: number;
  paid_subscribers: number;
  free_users: number;
  total_posts: number;
  total_api_calls: number;
  total_ai_usage: number;
}

export interface UserDetailedInfo {
  subscription: Subscription | null;
  social_connections: SocialConnection[];
  ai_usage_count: number;
  api_calls_count: number;
  total_posts: number;
  last_login: string | null;
}

