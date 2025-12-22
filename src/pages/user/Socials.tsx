import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Loader2, CheckCircle2, RefreshCw, Plus, Users, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { socialConnectionsApi, type SocialConnection } from "@/services/socialConnectionsApi";
import AnimatedPage from "@/components/animations/AnimatedPage";
import AnimatedCard from "@/components/animations/AnimatedCard";
import AnimatedNumber from "@/components/animations/AnimatedNumber";
import { motion, useReducedMotion } from "framer-motion";

const Socials = () => {
  const [loading, setLoading] = useState(true);
  const [socialConnections, setSocialConnections] = useState<SocialConnection[]>([]);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();
  
  useEffect(() => {
    loadSocialConnections();
  }, []);
  
  const loadSocialConnections = async () => {
    try {
      setLoading(true);
      const connections = await socialConnectionsApi.getConnectedAccounts();
      setSocialConnections(connections);
    } catch (error) {
      console.error("Error loading social connections:", error);
      toast.error("Failed to load social connections");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectSocial = async (platform: string) => {
    try {
      setConnectingPlatform(platform);
      const oauthUrl = await socialConnectionsApi.getOAuthUrl(platform);
      window.location.href = oauthUrl;
    } catch (error) {
      console.error("Error initiating connection:", error);
      toast.error("Failed to connect account. Please ensure API keys are configured.");
      setConnectingPlatform(null);
    }
  };

  const handleDisconnectSocial = async (connectionId: number, platform: string) => {
    try {
      await socialConnectionsApi.disconnectAccount(connectionId);
      toast.success(`${platform} account disconnected`);
      await loadSocialConnections();
    } catch (error) {
      console.error("Error disconnecting account:", error);
      toast.error("Failed to disconnect account");
    }
  };

  const handleRefreshConnection = async (connectionId: number, platform: string) => {
    try {
      await socialConnectionsApi.refreshConnection(connectionId);
      toast.success(`${platform} connection refreshed`);
      await loadSocialConnections();
    } catch (error) {
      console.error("Error refreshing connection:", error);
      toast.error("Failed to refresh connection");
    }
  };

  const getConnectionForPlatform = (platform: string): SocialConnection | undefined => {
    return socialConnections.find(c => c.platform === platform || c.platform === platform.toLowerCase());
  };

  const formatRelativeTime = (dateString: string | null) => {
    if (!dateString) return "Never";
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

  const platforms = [
    {
      key: 'twitter',
      name: 'Twitter/X',
      icon: '𝕏',
      bgColor: 'bg-black dark:bg-white',
      textColor: 'text-white dark:text-black',
      description: 'Share posts and track engagement on X',
    },
    {
      key: 'instagram',
      name: 'Instagram',
      icon: '📷',
      bgColor: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500',
      textColor: 'text-white',
      description: 'Share photos and stories with followers',
    },
    {
      key: 'facebook',
      name: 'Facebook',
      icon: 'f',
      bgColor: 'bg-blue-600',
      textColor: 'text-white',
      description: 'Post updates to pages and groups',
    },
    {
      key: 'linkedin',
      name: 'LinkedIn',
      icon: 'in',
      bgColor: 'bg-blue-700',
      textColor: 'text-white',
      description: 'Share professional content',
    },
    {
      key: 'tiktok',
      name: 'TikTok',
      icon: '🎵',
      bgColor: 'bg-black',
      textColor: 'text-white',
      description: 'Post short-form videos',
    },
    {
      key: 'threads',
      name: 'Threads',
      icon: '@',
      bgColor: 'bg-black dark:bg-white',
      textColor: 'text-white dark:text-black',
      description: 'Share text updates on Threads',
    },
  ];

  const connectedCount = socialConnections.length;
  const totalPlatforms = platforms.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <AnimatedPage>
      <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.1 
          }}
        >
          <h1 className="text-xl md:text-2xl font-semibold">Social Connections</h1>
          <p className="text-sm text-muted-foreground mt-1">Connect and manage your social media accounts</p>
        </motion.div>
      </div>

      {/* Connection Stats */}
      <div className="px-4 md:px-6 pb-4 md:pb-6">
        <AnimatedCard delay={0.15}>
          <motion.div
            whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <motion.div 
                      className="bg-primary/10 p-3 rounded-xl"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Globe className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                    </motion.div>
                    <div>
                      <p className="text-2xl md:text-3xl font-bold">
                        <AnimatedNumber value={connectedCount} /> <span className="text-muted-foreground text-base md:text-lg">/ {totalPlatforms}</span>
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">Platforms Connected</p>
                    </div>
                  </div>
                  {connectedCount > 0 && (
                    <motion.div
                      whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                      whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                    >
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => socialConnections.forEach(c => handleRefreshConnection(c.id, c.platform))}
                        className="h-9"
                      >
                        <motion.div
                          whileHover={shouldReduceMotion ? {} : { rotate: 180 }}
                          transition={{ duration: 0.3 }}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                        </motion.div>
                        Refresh All
                      </Button>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatedCard>
      </div>

      {/* Info Alert */}
      <div className="px-4 md:px-6 pb-4 md:pb-6">
        <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs md:text-sm">
            Connect your social accounts to enable post publishing and analytics tracking across all platforms.
          </AlertDescription>
        </Alert>
      </div>

      {/* Platforms Grid */}
      <div className="px-4 md:px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {platforms.map((platform) => {
            const connection = getConnectionForPlatform(platform.key);
            const isConnected = !!connection;
              const isConnecting = connectingPlatform === platform.key;
              const index = platforms.indexOf(platform);

            return (
              <AnimatedCard key={platform.key} delay={index * 0.08}>
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Card 
                    className={`overflow-hidden transition-all hover:shadow-md ${
                      isConnected ? 'border-l-4 border-l-green-500 bg-green-50/5 dark:bg-green-950/10' : ''
                    }`}
                  >
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <motion.div 
                      className={`h-12 w-12 md:h-14 md:w-14 ${platform.bgColor} rounded-xl flex items-center justify-center ${platform.textColor} font-bold text-xl md:text-2xl shadow-lg shrink-0`}
                      whileHover={shouldReduceMotion ? {} : { 
                        scale: 1.1, 
                        rotate: [0, -10, 10, 0],
                        transition: { duration: 0.5 }
                      }}
                    >
                      {platform.icon}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-base md:text-lg">{platform.name}</h3>
                        {isConnected && (
                          <Badge className="bg-green-500 text-white text-xs h-5">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                      
                      {isConnected && connection ? (
                        <>
                          <p className="text-xs md:text-sm text-muted-foreground mb-2 truncate">
                            @{connection.platform_username}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span className="font-medium">{connection.followers_count.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatRelativeTime(connection.last_synced_at)}</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="text-xs md:text-sm text-muted-foreground">{platform.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isConnected && connection ? (
                      <>
                        <motion.div 
                          className="flex-1"
                          whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-9 text-xs"
                            onClick={() => handleRefreshConnection(connection.id, platform.name)}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Refresh
                          </Button>
                        </motion.div>
                        <motion.div 
                          className="flex-1"
                          whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-9 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                            onClick={() => handleDisconnectSocial(connection.id, platform.name)}
                          >
                            Disconnect
                          </Button>
                        </motion.div>
                      </>
                    ) : (
                      <motion.div 
                        className="w-full"
                        whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                      >
                        <Button
                          size="sm"
                          className="w-full h-9 text-xs"
                          onClick={() => handleConnectSocial(platform.key)}
                          disabled={isConnecting}
                        >
                          {isConnecting ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              Connecting...
                            </>
                          ) : (
                            <>
                              <Plus className="h-3 w-3 mr-1" />
                              Connect
                            </>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
                </motion.div>
              </AnimatedCard>
            );
          })}
        </div>
      </div>
    </div>
    </AnimatedPage>
  );
};

export default Socials;
