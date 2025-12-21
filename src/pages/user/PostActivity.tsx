import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Calendar as CalendarIcon, Loader2, AlertCircle, FileText, Clock, Heart, 
  MessageCircle, Share2, RefreshCw, Eye, Bookmark, TrendingUp, 
  TrendingDown, Users, MousePointerClick, Play, ArrowUp, ArrowDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AiInsights from "@/components/dashboard/performance/AiInsights";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { socialConnectionsApi } from "@/services/socialConnectionsApi";
import { analyticsApi, type PlatformAnalytics, type DailyAnalytic } from "@/services/analyticsApi";
import { toast } from "sonner";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";

interface PostAnalytics {
  impressions: number;
  reach: number;
  engagements: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  video_views: number;
  engagement_rate: number;
  recorded_at: string;
}

interface PostData {
  id: number;
  content: string;
  platform: string;
  platform_post_id: string;
  platform_username: string;
  hashtags: string[];
  mentions: string[];
  published_at: string;
  analytics?: PostAnalytics;
}

interface PlatformStats {
  platform: string;
  posts_count: number;
  total_engagement: number;
  avg_engagement_rate: number;
  total_reach: number;
  total_impressions: number;
  followers_growth: number;
}

const PostActivity = () => {
  const [activeTab, setActiveTab] = useState<'recent' | 'scheduled' | 'insights'>('recent');
  const [recentPosts, setRecentPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInsights, setRefreshInsights] = useState<(() => Promise<void>) | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Date range state
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  
  // Stats state
  const [postsThisWeek, setPostsThisWeek] = useState(0);
  const [totalEngagement, setTotalEngagement] = useState(0);
  const [totalReach, setTotalReach] = useState(0);
  const [totalImpressions, setTotalImpressions] = useState(0);
  const [avgEngagementRate, setAvgEngagementRate] = useState(0);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [bestPlatform, setBestPlatform] = useState("N/A");
  const [platformStats, setPlatformStats] = useState<PlatformStats[]>([]);
  
  // Growth indicators
  const [engagementGrowth, setEngagementGrowth] = useState(0);
  const [reachGrowth, setReachGrowth] = useState(0);

  useEffect(() => {
    loadAllData();
  }, [dateRange]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadRecentPosts(),
        loadAnalyticsSummary(),
        loadPlatformAnalytics(),
      ]);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentPosts = async () => {
    try {
      setError(null);
      const response = await socialConnectionsApi.getRecentPosts();
      
      if (response.posts && response.posts.length > 0) {
        // Filter by date range if set
        let filteredPosts = response.posts;
        if (dateRange?.from && dateRange?.to) {
          filteredPosts = response.posts.filter(post => {
            const postDate = new Date(post.published_at);
            return postDate >= dateRange.from! && postDate <= dateRange.to!;
          });
        }
        
        setRecentPosts(filteredPosts);
        calculateBasicStats(filteredPosts);
      } else {
        setRecentPosts([]);
      }
    } catch (err: any) {
      console.error("Error loading recent posts:", err);
      setError(err.message || "Failed to load posts");
      toast.error("Failed to load recent posts");
    }
  };

  const loadAnalyticsSummary = async () => {
    try {
      const summary = await analyticsApi.getAnalyticsSummary();
      setTotalEngagement(summary.total_engagements);
      setTotalReach(summary.total_reach);
      setTotalImpressions(summary.total_impressions);
      setAvgEngagementRate(summary.avg_engagement_rate || 0);
    } catch (err: any) {
      console.error("Error loading analytics summary:", err);
    }
  };

  const loadPlatformAnalytics = async () => {
    try {
      const platforms = await analyticsApi.getAnalyticsByPlatform();
      
      // Transform backend data to our format
      const stats: PlatformStats[] = platforms.map((p: PlatformAnalytics) => ({
        platform: p.platform,
        posts_count: 0, // This would need to come from posts count
        total_engagement: p.total_engagements,
        avg_engagement_rate: p.avg_engagement_rate || 0,
        total_reach: p.total_reach,
        total_impressions: p.total_impressions,
        followers_growth: 0, // This would need daily analytics comparison
      }));

      setPlatformStats(stats);

      // Find best platform
      if (stats.length > 0) {
        const best = stats.reduce((prev, current) => 
          (current.total_engagement > prev.total_engagement) ? current : prev
        );
        setBestPlatform(best.platform.charAt(0).toUpperCase() + best.platform.slice(1));
      }

      // Load daily analytics for growth calculation
      await loadDailyAnalytics();
    } catch (err: any) {
      console.error("Error loading platform analytics:", err);
    }
  };

  const loadDailyAnalytics = async () => {
    try {
      if (!dateRange?.from || !dateRange?.to) return;

      const dailyAnalytics = await analyticsApi.getDailyAnalytics(
        undefined,
        format(dateRange.from, 'yyyy-MM-dd'),
        format(dateRange.to, 'yyyy-MM-dd')
      );

      if (dailyAnalytics.length === 0) return;

      // Calculate growth
      const midPoint = Math.floor(dailyAnalytics.length / 2);
      const firstHalf = dailyAnalytics.slice(0, midPoint);
      const secondHalf = dailyAnalytics.slice(midPoint);

      const firstHalfEng = firstHalf.reduce((sum, d) => sum + d.total_engagements, 0);
      const secondHalfEng = secondHalf.reduce((sum, d) => sum + d.total_engagements, 0);
      const firstHalfReach = firstHalf.reduce((sum, d) => sum + d.total_reach, 0);
      const secondHalfReach = secondHalf.reduce((sum, d) => sum + d.total_reach, 0);

      if (firstHalfEng > 0) {
        setEngagementGrowth(((secondHalfEng - firstHalfEng) / firstHalfEng) * 100);
      }
      if (firstHalfReach > 0) {
        setReachGrowth(((secondHalfReach - firstHalfReach) / firstHalfReach) * 100);
      }
    } catch (err: any) {
      console.error("Error loading daily analytics:", err);
    }
  };

  const calculateBasicStats = (posts: PostData[]) => {
    setPostsThisWeek(posts.length);

    // Calculate engagement metrics from posts
    let totalEng = 0;
    posts.forEach(post => {
      if (post.analytics) {
        totalEng += (post.analytics.likes || 0) + 
                    (post.analytics.comments || 0) + 
                    (post.analytics.shares || 0) +
                    (post.analytics.saves || 0);
      }
    });

    // Only update if we don't have data from analytics API
    if (totalEngagement === 0) {
      setTotalEngagement(totalEng);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getPlatformIcon = (platform: string) => {
    const icons: { [key: string]: JSX.Element } = {
      'instagram': (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="18" cy="6" r="1.5" fill="currentColor"/>
        </svg>
      ),
      'twitter': (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      'linkedin': (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      ),
      'facebook': (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
        </svg>
      ),
      'tiktok': (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
        </svg>
      ),
    };
    return icons[platform.toLowerCase()] || <FileText className="w-5 h-5" />;
  };

  const getEngagementBadgeVariant = (rate: number) => {
    if (rate > 5) return 'default';
    if (rate > 2) return 'secondary';
    return 'outline';
  };

  const handleRefreshInsights = async () => {
    if (refreshInsights) {
      setRefreshing(true);
      await refreshInsights();
      setRefreshing(false);
    }
  };

  const handleRefreshData = async () => {
    await loadAllData();
    toast.success("Data refreshed successfully");
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const scheduledPosts: any[] = [];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Header - Desktop only */}
      <div className="hidden md:flex justify-between items-center p-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-foreground">Post Activity</h1>
          <p className="text-muted-foreground mt-1">Track your post activity and engagement across platforms</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
          />
          <Button variant="outline" size="sm" onClick={handleRefreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {/* Stats Cards */}
      {/* Stats Cards */}
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 p-4 md:p-6">
  <Card className="border-l-4 border-l-primary">
    <CardContent className="p-3 md:p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground truncate">Total Posts</p>
          <div className="bg-primary/10 p-2 rounded-lg shrink-0">
            <BarChart className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          </div>
        </div>
        <p className="text-2xl md:text-3xl font-bold">{loading ? '...' : postsThisWeek}</p>
      </div>
    </CardContent>
  </Card>
  
  <Card className="border-l-4 border-l-green-500">
    <CardContent className="p-3 md:p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground truncate">Engagement</p>
          <div className="bg-green-500/10 p-2 rounded-lg shrink-0">
            <Heart className="h-4 w-4 md:h-5 md:w-5 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-2xl md:text-3xl font-bold">{loading ? '...' : totalEngagement.toLocaleString()}</p>
          {engagementGrowth !== 0 && (
            <div className={`flex items-center gap-1 text-xs ${engagementGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {engagementGrowth > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              <span>{Math.abs(engagementGrowth).toFixed(1)}%</span>
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
  
  <Card className="border-l-4 border-l-blue-500">
    <CardContent className="p-3 md:p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground truncate">Total Reach</p>
          <div className="bg-blue-500/10 p-2 rounded-lg shrink-0">
            <Users className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-2xl md:text-3xl font-bold">{loading ? '...' : totalReach.toLocaleString()}</p>
          {reachGrowth !== 0 && (
            <div className={`flex items-center gap-1 text-xs ${reachGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {reachGrowth > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              <span>{Math.abs(reachGrowth).toFixed(1)}%</span>
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
  
  <Card className="border-l-4 border-l-purple-500">
    <CardContent className="p-3 md:p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground truncate">Impressions</p>
          <div className="bg-purple-500/10 p-2 rounded-lg shrink-0">
            <Eye className="h-4 w-4 md:h-5 md:w-5 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <p className="text-2xl md:text-3xl font-bold">{loading ? '...' : totalImpressions.toLocaleString()}</p>
      </div>
    </CardContent>
  </Card>
  
  <Card className="border-l-4 border-l-pink-500">
    <CardContent className="p-3 md:p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground truncate">Avg Eng. Rate</p>
          <div className="bg-pink-500/10 p-2 rounded-lg shrink-0">
            <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-pink-600 dark:text-pink-400" />
          </div>
        </div>
        <p className="text-2xl md:text-3xl font-bold">{loading ? '...' : avgEngagementRate.toFixed(2)}%</p>
      </div>
    </CardContent>
  </Card>
  
  <Card className="border-l-4 border-l-amber-500">
    <CardContent className="p-3 md:p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground truncate">Best Platform</p>
          <div className="bg-amber-500/10 p-2 rounded-lg shrink-0">
            <BarChart className="h-4 w-4 md:h-5 md:w-5 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
        <p className="text-lg md:text-xl font-bold truncate">{loading ? '...' : bestPlatform}</p>
      </div>
    </CardContent>
  </Card>
</div>
      {/* Platform Performance Cards - Desktop Only */}
      {platformStats.length > 0 && (
        <div className="hidden md:block p-4 md:p-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
              <CardDescription>Compare performance across your connected platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {platformStats.map(stat => (
                  <Card key={stat.platform} className="border-l-4 border-l-primary/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-foreground">
                          {getPlatformIcon(stat.platform)}
                        </div>
                        <h3 className="font-bold capitalize">{stat.platform}</h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Engagement:</span>
                          <span className="font-medium">{stat.total_engagement.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Reach:</span>
                          <span className="font-medium">{stat.total_reach.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Impressions:</span>
                          <span className="font-medium">{stat.total_impressions.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Avg Eng. Rate:</span>
                          <span className="font-medium">{stat.avg_engagement_rate.toFixed(2)}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4 md:p-6 space-y-4">
        {/* Mobile: Date Range Picker */}
        <div className="md:hidden">
          <DateRangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            className="w-full"
          />
        </div>

        {/* Mobile: Tab Content */}
        <div className="md:hidden space-y-4">
          {activeTab === 'recent' && (
            <div className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <Card className="p-6">
                  <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm">{error}</p>
                  </div>
                </Card>
              ) : recentPosts.length === 0 ? (
                <Card className="p-8">
                  <div className="text-center">
                    <BarChart className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground">No posts yet. Connect your social accounts and start posting!</p>
                  </div>
                </Card>
              ) : (
                recentPosts.map(post => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="text-foreground">
                          {getPlatformIcon(post.platform)}
                        </div>
                        <span className="font-medium capitalize text-sm">{post.platform}</span>
                        {post.platform_username && (
                          <span className="text-xs text-muted-foreground">@{post.platform_username}</span>
                        )}
                        <span className="text-xs text-muted-foreground ml-auto">{formatDate(post.published_at)}</span>
                      </div>
                      <p className="text-sm mb-3 line-clamp-4 break-words">{post.content}</p>
                      
                      {post.analytics && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4 text-red-500" />
                              <span>{post.analytics.likes || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4 text-blue-500" />
                              <span>{post.analytics.comments || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Share2 className="h-4 w-4 text-green-500" />
                              <span>{post.analytics.shares || 0}</span>
                            </div>
                            {post.analytics.saves > 0 && (
                              <div className="flex items-center gap-1">
                                <Bookmark className="h-4 w-4 text-purple-500" />
                                <span>{post.analytics.saves}</span>
                              </div>
                            )}
                            {post.analytics.video_views > 0 && (
                              <div className="flex items-center gap-1">
                                <Play className="h-4 w-4 text-pink-500" />
                                <span>{post.analytics.video_views.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{post.analytics.impressions?.toLocaleString() || 0} impressions</span>
                            </div>
                            {post.analytics.reach > 0 && (
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{post.analytics.reach.toLocaleString()} reach</span>
                              </div>
                            )}
                            {post.analytics.clicks > 0 && (
                              <div className="flex items-center gap-1">
                                <MousePointerClick className="h-3 w-3" />
                                <span>{post.analytics.clicks} clicks</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant={getEngagementBadgeVariant(post.analytics.engagement_rate)}>
                              {post.analytics.engagement_rate.toFixed(2)}% engagement
                            </Badge>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === 'scheduled' && (
            <div className="space-y-3">
              {scheduledPosts.length === 0 ? (
                <Card className="p-8">
                  <div className="text-center">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground">No scheduled posts yet.</p>
                  </div>
                </Card>
              ) : (
                scheduledPosts.map(post => (
                  <Card key={post.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {getPlatformIcon(post.platform)}
                        <span className="font-medium text-sm capitalize">{post.platform}</span>
                        <span className="text-xs text-blue-500 ml-auto">{post.scheduledFor}</span>
                      </div>
                      <p className="text-sm break-words">{post.content}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === 'insights' && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-base">AI Insights</CardTitle>
                    <CardDescription className="text-xs">Data-driven suggestions for better performance</CardDescription>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-7 px-2 text-xs"
                    onClick={handleRefreshInsights}
                    disabled={refreshing}
                  >
                    <RefreshCw className={`h-3 w-3 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 overflow-x-hidden">
                <AiInsights onRefresh={(fn) => setRefreshInsights(() => fn)} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Desktop: Traditional Layout */}
        <div className="hidden md:block">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Posts</CardTitle>
                  <CardDescription>Your latest published content with detailed analytics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : error ? (
                    <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 p-4">
                      <AlertCircle className="h-5 w-5" />
                      <p>{error}</p>
                    </div>
                  ) : recentPosts.length === 0 ? (
                    <div className="text-center py-8">
                      <BarChart className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">No posts yet. Connect your social accounts and start posting!</p>
                    </div>
                  ) : (
                    recentPosts.map(post => (
                      <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="text-foreground">
                              {getPlatformIcon(post.platform)}
                            </div>
                            <span className="font-medium capitalize">{post.platform}</span>
                            {post.platform_username && (
                              <span className="text-xs text-muted-foreground">@{post.platform_username}</span>
                            )}
                            <span className="text-sm text-muted-foreground ml-auto">{formatDate(post.published_at)}</span>
                          </div>
                          <p className="mb-4 text-sm break-words">{post.content}</p>
                          
                          {post.analytics && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1.5">
                                  <Heart className="h-4 w-4 text-red-500" />
                                  <span className="font-medium">{post.analytics.likes || 0}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <MessageCircle className="h-4 w-4 text-blue-500" />
                                  <span className="font-medium">{post.analytics.comments || 0}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Share2 className="h-4 w-4 text-green-500" />
                                  <span className="font-medium">{post.analytics.shares || 0}</span>
                                </div>
                                {post.analytics.saves > 0 && (
                                  <div className="flex items-center gap-1.5">
                                    <Bookmark className="h-4 w-4 text-purple-500" />
                                    <span className="font-medium">{post.analytics.saves}</span>
                                  </div>
                                )}
                                {post.analytics.video_views > 0 && (
                                  <div className="flex items-center gap-1.5">
                                    <Play className="h-4 w-4 text-pink-500" />
                                    <span className="font-medium">{post.analytics.video_views.toLocaleString()}</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  <span>{post.analytics.impressions?.toLocaleString() || 0} impressions</span>
                                </div>
                                {post.analytics.reach > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    <span>{post.analytics.reach.toLocaleString()} reach</span>
                                  </div>
                                )}
                                {post.analytics.clicks > 0 && (
                                  <div className="flex items-center gap-1">
                                    <MousePointerClick className="h-3 w-3" />
                                    <span>{post.analytics.clicks} clicks</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Badge variant={getEngagementBadgeVariant(post.analytics.engagement_rate)}>
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  {post.analytics.engagement_rate.toFixed(2)}% engagement rate
                                </Badge>
                                {post.analytics.reach > 0 && post.analytics.impressions > 0 && (
                                  <span className="text-xs text-muted-foreground">
                                    {((post.analytics.reach / post.analytics.impressions) * 100).toFixed(1)}% reach rate
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">AI Insights</CardTitle>
                      <CardDescription>Data-driven recommendations</CardDescription>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-7 px-2 text-xs"
                      onClick={handleRefreshInsights}
                      disabled={refreshing}
                    >
                      <RefreshCw className={`h-3 w-3 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="overflow-x-hidden max-h-[600px] overflow-y-auto">
                  <AiInsights onRefresh={(fn) => setRefreshInsights(() => fn)} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
        <div className="grid grid-cols-3 h-16">
          <button
            onClick={() => setActiveTab('recent')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'recent' 
                ? 'text-foreground border-t-2 border-foreground' 
                : 'text-muted-foreground'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs font-medium">Recent</span>
          </button>
          
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'scheduled' 
                ? 'text-foreground border-t-2 border-foreground' 
                : 'text-muted-foreground'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="text-xs font-medium">Scheduled</span>
          </button>
          
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'insights' 
                ? 'text-foreground border-t-2 border-foreground' 
                : 'text-muted-foreground'
            }`}
          >
            <BarChart className="w-5 h-5" />
            <span className="text-xs font-medium">Insights</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostActivity;