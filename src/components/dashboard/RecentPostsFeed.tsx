
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, BarChart, Twitter, Instagram, Facebook, Linkedin, RefreshCw, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import authService from "@/services/auth";
import { toast } from "sonner";

interface Post {
  id: number;
  content: string;
  platforms: Array<{
    platform: string;
    analytics?: {
      likes: number;
      comments: number;
      shares: number;
      impressions: number;
      engagement_rate: number;
    };
  }>;
  hashtags: string[];
  published_at: string | null;
  status: string;
}

interface PostAnalytics {
  platform: string;
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
  engagement_rate: number;
}

// Platform icon mapping
const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case 'twitter':
      return <Twitter className="h-4 w-4 text-[#1DA1F2]" />;
    case 'instagram':
      return <Instagram className="h-4 w-4 text-[#E1306C]" />;
    case 'facebook':
      return <Facebook className="h-4 w-4 text-[#4267B2]" />;
    case 'linkedin':
      return <Linkedin className="h-4 w-4 text-[#0077B5]" />;
    default:
      return null;
  }
};

const RecentPostsFeed = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async (showToast = false) => {
    try {
      if (!showToast) setLoading(true);
      else setRefreshing(true);

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const token = authService.getToken();

      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/api/posts/?status=published&ordering=-published_at&limit=5`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      const results = data.results || data;
      
      // Fetch analytics for each post
      const postsWithAnalytics = await Promise.all(
        results.map(async (post: any) => {
          // Get platform data with analytics
          const platforms = await Promise.all(
            (post.platforms || []).map(async (platformData: any) => {
              // Fetch analytics for this post+platform
              try {
                const analyticsResponse = await fetch(
                  `${API_BASE_URL}/api/analytics/posts/?post=${post.id}&platform=${platformData.platform}`,
                  {
                    headers: {
                      'Authorization': `Token ${token}`,
                    },
                  }
                );
                
                if (analyticsResponse.ok) {
                  const analyticsData = await analyticsResponse.json();
                  const analytics = (analyticsData.results || analyticsData)[0];
                  return {
                    platform: platformData.platform,
                    analytics: analytics ? {
                      likes: analytics.likes || 0,
                      comments: analytics.comments || 0,
                      shares: analytics.shares || 0,
                      impressions: analytics.impressions || 0,
                      engagement_rate: parseFloat(analytics.engagement_rate || '0'),
                    } : undefined,
                  };
                }
              } catch (error) {
                console.error(`Error fetching analytics for ${platformData.platform}:`, error);
              }

              return { platform: platformData.platform, analytics: undefined };
            })
          );

          return {
            id: post.id,
            content: post.content || '',
            platforms,
            hashtags: post.hashtags || [],
            published_at: post.published_at,
            status: post.status,
          };
        })
      );

      setPosts(postsWithAnalytics);
      
      if (showToast) {
        toast.success('Posts refreshed!');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      if (showToast) {
        toast.error('Failed to refresh posts');
      }
      setPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleRefresh = () => {
    fetchPosts(true);
  };

  const togglePostExpansion = (id: number) => {
    setExpandedPost(expandedPost === id ? null : id);
  };

  const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="border shadow-md">
      <CardHeader className="flex flex-row justify-between items-center bg-gray-50 dark:bg-gray-800/50 border-b p-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Recent Posts
          {posts.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {posts.length}
            </Badge>
          )}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Twitter className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-sm font-medium text-muted-foreground mb-2">No posts yet</p>
              <p className="text-xs text-muted-foreground">
                Connect your social accounts and start posting to see your recent activity here!
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y">
                {posts.map((post) => {
                  // Calculate total stats across all platforms
                  const totalLikes = post.platforms.reduce((sum, p) => sum + (p.analytics?.likes || 0), 0);
                  const totalComments = post.platforms.reduce((sum, p) => sum + (p.analytics?.comments || 0), 0);
                  const totalShares = post.platforms.reduce((sum, p) => sum + (p.analytics?.shares || 0), 0);
                  const totalImpressions = post.platforms.reduce((sum, p) => sum + (p.analytics?.impressions || 0), 0);

                  return (
                    <div key={post.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="flex gap-4">
                        {/* Platform icon */}
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-md flex items-center justify-center">
                            {post.platforms.length > 0 ? (
                              <PlatformIcon platform={post.platforms[0].platform} />
                            ) : (
                              <Twitter className="h-6 w-6 text-primary" />
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Post content preview */}
                          <p className="text-sm line-clamp-2 mb-2 dark:text-gray-200">
                            {post.content}
                          </p>

                          {/* Hashtags */}
                          {post.hashtags && post.hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {post.hashtags.slice(0, 3).map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                              {post.hashtags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{post.hashtags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            {/* Platform icons */}
                            <div className="flex gap-1">
                              {post.platforms.map((platformData, idx) => (
                                <div key={idx} className="flex items-center">
                                  <PlatformIcon platform={platformData.platform} />
                                </div>
                              ))}
                            </div>

                            {/* Stats */}
                            {post.status === 'published' && totalImpressions > 0 ? (
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{totalLikes} likes</span>
                                <span>•</span>
                                <span>{totalComments} comments</span>
                                <span>•</span>
                                <span>{totalShares} shares</span>
                              </div>
                            ) : post.status === 'scheduled' ? (
                              <Badge variant="outline" className="text-xs font-normal py-0 h-5">Scheduled</Badge>
                            ) : null}

                            {/* Time */}
                            <span className="italic">
                              {post.status === 'published' ? `${formatTimeAgo(post.published_at)}` : post.status}
                            </span>
                          </div>
                        </div>

                        {/* Post actions */}
                        <div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs h-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePostExpansion(post.id);
                            }}
                          >
                            <BarChart className="h-3 w-3 mr-1" /> 
                            {expandedPost === post.id ? 'Hide' : 'Details'}
                          </Button>
                        </div>
                      </div>

                      {/* Expanded post stats */}
                      {expandedPost === post.id && (
                        <div className="mt-4 pt-4 border-t dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
                          {post.platforms.map((platformData, idx) => (
                            <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 rounded-md p-3 border dark:border-gray-700">
                              <div className="flex items-center gap-2 mb-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="bg-white dark:bg-gray-700">
                                    <PlatformIcon platform={platformData.platform} />
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium capitalize">{platformData.platform}</span>
                              </div>
                              
                              {platformData.analytics ? (
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="text-xs">
                                    <div className="text-gray-500 dark:text-gray-400">Likes</div>
                                    <div className="font-medium dark:text-gray-200">{platformData.analytics.likes}</div>
                                  </div>
                                  <div className="text-xs">
                                    <div className="text-gray-500 dark:text-gray-400">Shares</div>
                                    <div className="font-medium dark:text-gray-200">{platformData.analytics.shares}</div>
                                  </div>
                                  <div className="text-xs">
                                    <div className="text-gray-500 dark:text-gray-400">Comments</div>
                                    <div className="font-medium dark:text-gray-200">{platformData.analytics.comments}</div>
                                  </div>
                                  <div className="text-xs">
                                    <div className="text-gray-500 dark:text-gray-400">Impressions</div>
                                    <div className="font-medium dark:text-gray-200">{platformData.analytics.impressions.toLocaleString()}</div>
                                  </div>
                                  <div className="text-xs col-span-2">
                                    <div className="text-gray-500 dark:text-gray-400">Engagement Rate</div>
                                    <div className="font-medium text-green-600 dark:text-green-400">
                                      {platformData.analytics.engagement_rate.toFixed(2)}%
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  No analytics available
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="p-4 flex justify-center border-t dark:border-gray-700">
                <Button variant="outline" size="sm">
                  View All Posts
                </Button>
              </div>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default RecentPostsFeed;
