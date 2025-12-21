import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw, Twitter, Facebook, Instagram, Linkedin, MessageCircle, Heart, Share2, Eye, TrendingUp } from "lucide-react";
import { socialConnectionsApi } from "@/services/socialConnectionsApi";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const RecentPosts = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (showToast = false) => {
    try {
      if (!refreshing) setLoading(true);
      
      const data = await socialConnectionsApi.getRecentPosts();
      setPosts(data.posts || []);
      
      if (showToast) {
        toast.success(`Loaded ${data.count} posts`);
      }
    } catch (error) {
      console.error("Error loading recent posts:", error);
      setPosts([]);
      
      if (showToast) {
        toast.error("Failed to load posts");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPosts(true);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter':
        return 'bg-blue-500';
      case 'facebook':
        return 'bg-blue-600';
      case 'instagram':
        return 'bg-gradient-to-br from-purple-500 to-pink-500';
      case 'linkedin':
        return 'bg-blue-700';
      default:
        return 'bg-gray-500';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading && !refreshing) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border p-4">
        <h3 className="font-medium dark:text-white mb-4">Recent Posts</h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium dark:text-white">Recent Posts from Connected Accounts</h3>
        <Button 
          size="sm" 
          variant="outline"
          className="h-7 px-2 text-xs"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-8 px-4">
          <MessageCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-sm font-medium text-muted-foreground mb-2">No posts found</p>
          <p className="text-xs text-muted-foreground">
            Connect your social accounts to see your recent posts and their performance!
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`${getPlatformColor(post.platform)} rounded-full p-1.5 text-white`}>
                      {getPlatformIcon(post.platform)}
                    </div>
                    <div>
                      <p className="text-sm font-medium dark:text-white">
                        @{post.platform_username}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full capitalize">
                    {post.platform}
                  </span>
                </div>

                {/* Content */}
                <p className="text-sm dark:text-gray-300 mb-3 line-clamp-3">
                  {post.content}
                </p>

                {/* Hashtags */}
                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.hashtags.map((tag: string, idx: number) => (
                      <span 
                        key={idx}
                        className="text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Analytics */}
                {post.analytics && (
                  <div className="grid grid-cols-4 gap-2 pt-3 border-t dark:border-gray-700">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {formatNumber(post.analytics.impressions)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-muted-foreground">
                        {formatNumber(post.analytics.likes)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3 text-blue-500" />
                      <span className="text-xs text-muted-foreground">
                        {formatNumber(post.analytics.comments)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">
                        {post.analytics.engagement_rate.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentPosts;
