import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, MessageCircle, LayoutGrid, Sparkles, ChevronRight, Loader2, TrendingUp, TrendingDown, Table2, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import EngagementLineChart from "@/components/dashboard/performance/EngagementLineChart";
import PlatformComparisonChart from "@/components/dashboard/performance/PlatformComparisonChart";
import AiInsights from "@/components/dashboard/performance/AiInsights";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import authService from "@/services/auth";
import { socialConnectionsApi } from "@/services/socialConnectionsApi";
import { toast } from "sonner";
import PlatformPieChart from "@/components/dashboard/performance/PlatformPieChart";
import PlatformBarChart from "@/components/dashboard/performance/PlatformBarChart";
import PlatformLineChart from "@/components/dashboard/performance/PlatformLineChart";
import PlatformTableView from "@/components/dashboard/performance/PlatformTableView";


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

type ViewType = 'table' | 'bar' | 'line' | 'pie';

const PerformanceDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'engagement' | 'platforms' | 'insights'>('overview');
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);
  const [viewType, setViewType] = useState<ViewType>('bar');
  
  const [analytics, setAnalytics] = useState<AnalyticsSummary>({
    total_impressions: 0,
    total_engagements: 0,
    total_reach: 0,
    avg_engagement_rate: 0,
  });
  const [platformAnalytics, setPlatformAnalytics] = useState<PlatformAnalytics[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

      // Fetch analytics summary
      const analyticsResponse = await fetch(`${API_BASE_URL}/api/analytics/posts/summary/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData);
      }

      // Fetch platform analytics
      const platformResponse = await fetch(`${API_BASE_URL}/api/analytics/posts/by_platform/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (platformResponse.ok) {
        const platformData = await platformResponse.json();
        setPlatformAnalytics(platformData);
      }

      // Fetch connections
      const connectionsData = await socialConnectionsApi.getConnectedAccounts();
      setConnections(connectionsData);

      // Fetch recent posts
      const postsData = await socialConnectionsApi.getRecentPosts();
      setRecentPosts(postsData.posts || []);

    } catch (error) {
      console.error("Error loading analytics:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const activeConnections = connections.filter(c => c.is_active);

  // Platform icon mapping
  const getPlatformIcon = (platform: string) => {
    const icons: { [key: string]: JSX.Element } = {
      'instagram': (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="18" cy="6" r="1.5" fill="currentColor"/>
        </svg>
      ),
      'twitter': (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
        </svg>
      ),
      'linkedin': (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      ),
      'facebook': (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
        </svg>
      ),
    };
    return icons[platform.toLowerCase()] || <LayoutGrid className="w-6 h-6" />;
  };

  // Get platform data
  const getPlatformData = (platform: string) => {
    return platformAnalytics.find(p => p.platform.toLowerCase() === platform.toLowerCase());
  };

  // Render chart based on view type
  const renderChart = (height: string = "h-[320px]") => {
    const content = (() => {
      switch (viewType) {
        case 'table':
          return <PlatformTableView platformData={platformAnalytics} />;
        case 'bar':
          return <PlatformBarChart platformData={platformAnalytics} metric="all" />;
        case 'line':
          return <PlatformLineChart platformData={platformAnalytics} metric="all" />;
        case 'pie':
          return <PlatformPieChart platformData={platformAnalytics} metric="engagements" />;
        default:
          return <PlatformBarChart platformData={platformAnalytics} metric="all" />;
      }
    })();

    return viewType === 'table' ? content : <div className={height}>{content}</div>;
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Header - Desktop only */}
      <div className="hidden md:flex justify-between items-center p-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Performance Dashboard</h1>
          <p className="text-muted-foreground">Track your social media metrics across platforms</p>
        </div>
        <ThemeToggle />
      </div>

      {/* Stats Cards - Always visible on top */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 p-4 md:p-6">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Reach</p>
            <p className="text-xl md:text-2xl font-bold">{loading ? "..." : analytics.total_reach.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Engagement</p>
            <p className="text-xl md:text-2xl font-bold">{loading ? "..." : analytics.total_engagements.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Impressions</p>
            <p className="text-xl md:text-2xl font-bold">{loading ? "..." : analytics.total_impressions.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Platforms</p>
            <p className="text-xl md:text-2xl font-bold">{activeConnections.length}/5</p>
          </CardContent>
        </Card>
      </div>
{/* Desktop Tab Navigation */}
<div className="hidden md:flex items-center justify-between px-6 mb-4 border-b border-border">
  <div className="flex items-center gap-1">
    <button
      onClick={() => setActiveTab('overview')}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
        activeTab === 'overview'
          ? 'border-primary text-foreground'
          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
      }`}
    >
      <Eye className="w-4 h-4" />
      Overview
    </button>
    
    <button
      onClick={() => setActiveTab('engagement')}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
        activeTab === 'engagement'
          ? 'border-primary text-foreground'
          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
      }`}
    >
      <MessageCircle className="w-4 h-4" />
      Engagement
    </button>
    
    <button
      onClick={() => setActiveTab('platforms')}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
        activeTab === 'platforms'
          ? 'border-primary text-foreground'
          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
      }`}
    >
      <LayoutGrid className="w-4 h-4" />
      Platforms
    </button>
    
    <button
      onClick={() => setActiveTab('insights')}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
        activeTab === 'insights'
          ? 'border-primary text-foreground'
          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
      }`}
    >
      <Sparkles className="w-4 h-4" />
      AI Insights
    </button>
  </div>

  {/* View Type Selector - Desktop */}
  {activeTab !== 'insights' && (
    <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
      <Button
        variant={viewType === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewType('table')}
        className="h-8 px-3"
      >
        <Table2 className="w-4 h-4" />
      </Button>
      <Button
        variant={viewType === 'bar' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewType('bar')}
        className="h-8 px-3"
      >
        <BarChart3 className="w-4 h-4" />
      </Button>
      <Button
        variant={viewType === 'line' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewType('line')}
        className="h-8 px-3"
      >
        <LineChartIcon className="w-4 h-4" />
      </Button>
      <Button
        variant={viewType === 'pie' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewType('pie')}
        className="h-8 px-3"
      >
        <PieChartIcon className="w-4 h-4" />
      </Button>
    </div>
  )}
</div>
      {/* Main Content */}
      <div className="p-4 md:p-6">
        {/* Content Performance Section - Mobile Accordion */}
        <div className="md:hidden mb-6">
          <h2 className="text-xl font-bold mb-4 text-center">Content Performance</h2>
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : activeConnections.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <p>No platforms connected</p>
                  <p className="text-sm mt-1">Connect your social accounts to see performance</p>
                </div>
              ) : (
                <div className="divide-y">
                  {activeConnections.map((connection) => {
                    const platformData = getPlatformData(connection.platform);
                    const isExpanded = expandedPlatform === connection.platform;
                    
                    return (
                      <Collapsible
                        key={connection.id}
                        open={isExpanded}
                        onOpenChange={() => setExpandedPlatform(isExpanded ? null : connection.platform)}
                      >
                        <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-accent transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="text-foreground">
                              {getPlatformIcon(connection.platform)}
                            </div>
                            <span className="font-medium capitalize">{connection.platform}</span>
                          </div>
                          <ChevronRight className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          {platformData ? (
                            <div className="p-4 bg-accent/50 space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-background rounded-lg p-3">
                                  <p className="text-xs text-muted-foreground">Engagements</p>
                                  <p className="text-lg font-bold">{platformData.total_engagements.toLocaleString()}</p>
                                </div>
                                <div className="bg-background rounded-lg p-3">
                                  <p className="text-xs text-muted-foreground">Impressions</p>
                                  <p className="text-lg font-bold">{platformData.total_impressions.toLocaleString()}</p>
                                </div>
                                <div className="bg-background rounded-lg p-3">
                                  <p className="text-xs text-muted-foreground">Reach</p>
                                  <p className="text-lg font-bold">{platformData.total_reach.toLocaleString()}</p>
                                </div>
                                <div className="bg-background rounded-lg p-3">
                                  <p className="text-xs text-muted-foreground">Avg. Rate</p>
                                  <p className="text-lg font-bold">{(platformData.avg_engagement_rate * 100).toFixed(1)}%</p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                              No data available
                            </div>
                          )}
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* View Type Selector - Mobile */}
        {activeTab !== 'insights' && (
          <div className="md:hidden flex items-center justify-center gap-1 bg-muted/50 p-1 rounded-lg mb-4 mx-4">
            <Button
              variant={viewType === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('table')}
              className="flex-1 h-9"
            >
              <Table2 className="w-4 h-4 mr-1" />
              <span className="text-xs">Table</span>
            </Button>
            <Button
              variant={viewType === 'bar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('bar')}
              className="flex-1 h-9"
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              <span className="text-xs">Bar</span>
            </Button>
            <Button
              variant={viewType === 'line' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('line')}
              className="flex-1 h-9"
            >
              <LineChartIcon className="w-4 h-4 mr-1" />
              <span className="text-xs">Line</span>
            </Button>
            <Button
              variant={viewType === 'pie' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('pie')}
              className="flex-1 h-9"
            >
              <PieChartIcon className="w-4 h-4 mr-1" />
              <span className="text-xs">Pie</span>
            </Button>
          </div>
        )}

        {/* Tab Content */}
        <div className="space-y-4">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold hidden md:block">Overview</h3>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Platform Performance</CardTitle>
                  <CardDescription className="text-xs">All metrics across platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderChart("h-[280px] md:h-[350px]")}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Engagement Tab */}
          {activeTab === 'engagement' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Engagement Breakdown</h3>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Engagement by Platform</CardTitle>
                  <CardDescription className="text-xs">Total engagements across all platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderChart("h-[280px] md:h-[350px]")}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Platforms Tab */}
          {activeTab === 'platforms' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Platform Performance</h3>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">All Platform Metrics</CardTitle>
                  <CardDescription className="text-xs">Comprehensive performance data</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderChart("h-[280px] md:h-[350px]")}
                </CardContent>
              </Card>
            </div>
          )}

          {/* AI Insights Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">AI-Powered Insights</h3>
              <Card>
                <CardContent className="p-4 md:p-6">
                  <AiInsights />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      

      {/* Top Performing Content & Platform Overview - Below tabs on all screens */}
      <div className="p-4 md:px-6 pb-24 md:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Top Performing Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Top Performing Content</CardTitle>
              <CardDescription className="text-xs md:text-sm">Your best posts based on engagement</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (() => {
                const topPosts = recentPosts
                  .filter(post => post.analytics)
                  .sort((a, b) => {
                    const aEngagement = (a.analytics?.likes || 0) + (a.analytics?.shares || 0) + (a.analytics?.comments || 0);
                    const bEngagement = (b.analytics?.likes || 0) + (b.analytics?.shares || 0) + (b.analytics?.comments || 0);
                    return bEngagement - aEngagement;
                  })
                  .slice(0, 3);

                return topPosts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm md:text-base">No posts with analytics data yet.</p>
                    <p className="text-xs md:text-sm mt-1">Start posting to see your top performing content!</p>
                  </div>
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    {topPosts.map((post, index) => (
                      <div key={post.id} className="flex items-start gap-3 md:gap-4 pb-3 md:pb-4 border-b last:border-b-0 last:pb-0">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="font-semibold text-sm md:text-base">{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm md:text-base line-clamp-2 mb-1">{post.content}</p>
                          <div className="flex flex-wrap items-center gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground">
                            <span className="capitalize font-medium">{post.platform}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{post.analytics?.likes || 0} likes</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="sm:inline">{post.analytics?.shares || 0} shares</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline">{post.analytics?.comments || 0} comments</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
          
          {/* Platform Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Platform Overview</CardTitle>
              <CardDescription className="text-xs md:text-sm">Performance breakdown by platform</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : platformAnalytics.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm md:text-base">No analytics data available yet.</p>
                  <p className="text-xs md:text-sm mt-1">Connect platforms and start posting to see analytics!</p>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {platformAnalytics.map((platform) => (
                    <div key={platform.platform} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 md:w-6 md:h-6">
                            {getPlatformIcon(platform.platform)}
                          </div>
                          <span className="text-sm md:text-base font-medium capitalize">{platform.platform}</span>
                        </div>
                        <span className="text-xs md:text-sm text-muted-foreground font-medium">
                          {platform.total_engagements.toLocaleString()}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Impressions: {platform.total_impressions.toLocaleString()}</span>
                          <span>Reach: {platform.total_reach.toLocaleString()}</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-300" 
                            style={{ 
                              width: `${Math.min(100, (platform.total_engagements / Math.max(...platformAnalytics.map(p => p.total_engagements))) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar - Fixed */}
      {/* Mobile Bottom Tab Bar - Fixed */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        <div className="grid grid-cols-4 h-16">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'overview' 
                ? 'text-foreground border-t-2 border-foreground' 
                : 'text-muted-foreground'
            }`}
          >
            <Eye className="w-5 h-5" />
            <span className="text-xs font-medium">Overview</span>
          </button>
          
          <button
            onClick={() => setActiveTab('engagement')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'engagement' 
                ? 'text-foreground border-t-2 border-foreground' 
                : 'text-muted-foreground'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs font-medium">Engagement</span>
          </button>
          
          <button
            onClick={() => setActiveTab('platforms')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'platforms' 
                ? 'text-foreground border-t-2 border-foreground' 
                : 'text-muted-foreground'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="text-xs font-medium">Platforms</span>
          </button>
          
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'insights' 
                ? 'text-foreground border-t-2 border-foreground' 
                : 'text-muted-foreground'
            }`}
          >
            <Sparkles className="w-5 w-5" />
            <span className="text-xs font-medium">AI Insight</span>
          </button>
        </div>
      </div>

      {/* Desktop Tab Navigation */}
      <div className="hidden md:block fixed top-20 right-6">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default PerformanceDashboard;