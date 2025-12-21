import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Lock, Bell, Globe, Loader2, CheckCircle2, RefreshCw, Settings, Users, Clock, Plus, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PenSquare } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import userApi from "@/services/userApi";
import type { UserDetail } from "@/types/user";
import { socialConnectionsApi, type SocialConnection } from "@/services/socialConnectionsApi";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const UserSettings = () => {
  const [activeTab, setActiveTab] = useState<'social' | 'profile' | 'security' | 'notifications'>('social');
  const [loading, setLoading] = useState(true);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  
  // Profile state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Preferences state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [postPerformanceReports, setPostPerformanceReports] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [marketingUpdates, setMarketingUpdates] = useState(false);
  
  const [saveLoading, setSaveLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  // Social connections state
  const [socialConnections, setSocialConnections] = useState<SocialConnection[]>([]);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  
  // Load user data on mount
  useEffect(() => {
    loadUserData();
    loadSocialConnections();
  }, []);
  
  const loadUserData = async () => {
    try {
      setLoading(true);
      const data = await userApi.getCurrentUser();
      setUserDetail(data);
      
      // Populate form fields
      setUsername(data.username);
      setEmail(data.email);
      setFirstName(data.first_name);
      setLastName(data.last_name);
      setBio(data.profile?.bio || "");
      
      // Set preferences
      if (data.preferences) {
        setEmailNotifications(data.preferences.email_notifications);
        setPostPerformanceReports(data.preferences.weekly_digest);
        setAiSuggestions(data.preferences.push_notifications);
        setMarketingUpdates(data.preferences.email_notifications);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error("Failed to load user settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaveLoading(true);
      
      await userApi.updateCurrentUser({
        username: username,
        email: email,
        first_name: firstName,
        last_name: lastName,
      });
      
      await userApi.updateCurrentProfile({
        bio: bio,
        full_name: `${firstName} ${lastName}`.trim(),
      });
      
      toast.success("Profile settings updated successfully");
      await loadUserData();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile settings");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      setPasswordLoading(true);
      
      await userApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password changed successfully");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error instanceof Error ? error.message : "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };
  
  const handleSaveNotifications = async () => {
    try {
      setSaveLoading(true);
      
      await userApi.updateCurrentPreferences({
        email_notifications: emailNotifications,
        weekly_digest: postPerformanceReports,
        push_notifications: aiSuggestions,
      });
      
      toast.success("Notification settings saved");
    } catch (error) {
      console.error("Error saving notifications:", error);
      toast.error("Failed to save notification settings");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success("Profile picture updated");
    }
  };

  const loadSocialConnections = async () => {
    try {
      const connections = await socialConnectionsApi.getConnectedAccounts();
      setSocialConnections(connections);
    } catch (error) {
      console.error("Error loading social connections:", error);
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
      description: 'Connect your X account to share posts and track engagement',
      color: 'black'
    },
    {
      key: 'instagram',
      name: 'Instagram',
      icon: '📷',
      bgColor: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500',
      textColor: 'text-white',
      description: 'Share photos and stories with your Instagram followers',
      color: 'purple'
    },
    {
      key: 'facebook',
      name: 'Facebook',
      icon: 'f',
      bgColor: 'bg-blue-600',
      textColor: 'text-white',
      description: 'Post updates to your Facebook page and groups',
      color: 'blue'
    },
    {
      key: 'linkedin',
      name: 'LinkedIn',
      icon: 'in',
      bgColor: 'bg-blue-700',
      textColor: 'text-white',
      description: 'Share professional content with your LinkedIn network',
      color: 'blue'
    },
    {
      key: 'tiktok',
      name: 'TikTok',
      icon: '🎵',
      bgColor: 'bg-black',
      textColor: 'text-white',
      description: 'Post short-form videos to TikTok',
      color: 'black'
    },
    {
      key: 'threads',
      name: 'Threads',
      icon: '@',
      bgColor: 'bg-black dark:bg-white',
      textColor: 'text-white dark:text-black',
      description: 'Share text updates on Threads',
      color: 'black'
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
  
  if (!userDetail) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Failed to load user settings</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Header - Desktop only */}
      <div className="hidden md:flex justify-between items-center p-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text">Connected Accounts</h1>
          <p className="text-muted-foreground mt-1">Manage your social media integrations</p>
        </div>
        <ThemeToggle />
      </div>

      {/* Connection Stats */}
      <div className="p-4 md:p-6">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 md:p-4 rounded-xl">
                  <Globe className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold">
                    {connectedCount} <span className="text-muted-foreground text-lg">/ {totalPlatforms}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">Platforms Connected</p>
                </div>
              </div>
              {connectedCount > 0 && (
                <Button variant="outline" size="sm" onClick={() => socialConnections.forEach(c => handleRefreshConnection(c.id, c.platform))}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh All
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-6 space-y-4">
        {/* Mobile: Tab Content */}
        <div className="md:hidden space-y-4">
          {activeTab === 'social' && (
            <div className="space-y-3">
              <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Connect your social accounts to enable post publishing and analytics tracking.
                </AlertDescription>
              </Alert>

              {platforms.map((platform) => {
                const connection = getConnectionForPlatform(platform.key);
                const isConnected = !!connection;
                const isConnecting = connectingPlatform === platform.key;

                return (
                  <Card key={platform.key} className={`overflow-hidden transition-all ${
                    isConnected ? 'border-l-4 border-l-green-500 bg-green-50/5 dark:bg-green-950/10' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`h-12 w-12 ${platform.bgColor} rounded-xl flex items-center justify-center ${platform.textColor} font-bold text-xl shadow-lg shrink-0`}>
                          {platform.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold">{platform.name}</h3>
                            {isConnected && (
                              <Badge className="bg-green-500 text-white text-xs">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Connected
                              </Badge>
                            )}
                          </div>
                          
                          {isConnected && connection ? (
                            <>
                              <p className="text-xs text-muted-foreground mb-2">
                                @{connection.platform_username}
                              </p>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Users className="h-3 w-3" />
                                  <span className="font-medium">{connection.followers_count.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatRelativeTime(connection.last_synced_at)}</span>
                                </div>
                              </div>
                            </>
                          ) : (
                            <p className="text-xs text-muted-foreground">{platform.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {isConnected && connection ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 h-8 text-xs"
                              onClick={() => handleRefreshConnection(connection.id, platform.name)}
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Refresh
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 h-8 text-xs text-red-600 hover:text-red-700"
                              onClick={() => handleDisconnectSocial(connection.id, platform.name)}
                            >
                              Disconnect
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            className="w-full h-8 text-xs"
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
                                Connect Account
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {activeTab === 'profile' && (
            <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={userDetail.profile?.avatar_url || ""} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                        {userDetail.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  <Button 
                    size="icon" 
                    variant="secondary" 
                      className="absolute bottom-0 right-0 rounded-full h-7 w-7"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                  >
                      <PenSquare size={12} />
                  </Button>
                  <input 
                    type="file" 
                    id="avatar-upload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </div>
                  <div>
                    <h3 className="font-medium">@{username}</h3>
                    <p className="text-xs text-muted-foreground">{email}</p>
                </div>
              </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="username" className="text-xs">Username</Label>
                    <Input 
                      id="username" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="h-9"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="first-name" className="text-xs">First name</Label>
                      <Input 
                        id="first-name" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="last-name" className="text-xs">Last name</Label>
                      <Input 
                        id="last-name" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="h-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bio" className="text-xs">Bio</Label>
                    <Input 
                      id="bio" 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <Button 
                    onClick={handleSaveProfile} 
                    disabled={saveLoading}
                    className="w-full"
                  >
                    {saveLoading ? "Saving..." : "Save Changes"}
              </Button>
              </div>
            </CardContent>
          </Card>
          )}

          {activeTab === 'security' && (
            <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="current-password" className="text-xs">Current Password</Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                      className="h-9"
                  />
                </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="new-password" className="text-xs">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                      className="h-9"
                  />
                </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirm-password" className="text-xs">Confirm New Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-9"
                  />
                </div>
                <Button 
                  onClick={handleChangePassword} 
                  disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                    className="w-full"
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </CardContent>
          </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Choose what you want to be notified about</CardDescription>
            </CardHeader>
              <CardContent className="space-y-4">
              <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Email Notifications</p>
                      <p className="text-xs text-muted-foreground">Get notified via email</p>
                  </div>
                  <Switch 
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Performance Reports</p>
                      <p className="text-xs text-muted-foreground">Weekly analytics reports</p>
                  </div>
                  <Switch 
                    checked={postPerformanceReports}
                    onCheckedChange={setPostPerformanceReports}
                  />
                </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">AI Suggestions</p>
                      <p className="text-xs text-muted-foreground">Content recommendations</p>
                  </div>
                  <Switch 
                    checked={aiSuggestions}
                    onCheckedChange={setAiSuggestions}
                  />
                </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Marketing Updates</p>
                      <p className="text-xs text-muted-foreground">Feature updates and offers</p>
                  </div>
                  <Switch 
                    checked={marketingUpdates}
                    onCheckedChange={setMarketingUpdates}
                  />
                </div>
              </div>
              <Button 
                onClick={handleSaveNotifications}
                disabled={saveLoading}
                  className="w-full"
              >
                {saveLoading ? "Saving..." : "Save Preferences"}
              </Button>
              </CardContent>
          </Card>
          )}
        </div>

        {/* Desktop: Hero Social Accounts Section */}
        <div className="hidden md:block space-y-6">
              <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
                  Connect your social media accounts to enable post publishing, analytics tracking, and AI-powered insights.
              Your credentials are securely encrypted and stored.
                </AlertDescription>
              </Alert>

          {/* 2-Column Grid for Platforms */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {platforms.map((platform) => {
                  const connection = getConnectionForPlatform(platform.key);
                  const isConnected = !!connection;
                  const isConnecting = connectingPlatform === platform.key;

                  return (
                <Card key={platform.key} className={`overflow-hidden transition-all hover:shadow-lg ${
                  isConnected ? 'border-l-4 border-l-green-500 bg-green-50/5 dark:bg-green-950/10' : 'hover:border-primary/50'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Large Platform Icon */}
                      <div className={`h-16 w-16 ${platform.bgColor} rounded-xl flex items-center justify-center ${platform.textColor} font-bold text-3xl shadow-lg shrink-0`}>
                              {platform.icon}
                            </div>
                      
                      {/* Info Section */}
                            <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold">{platform.name}</h3>
                                {isConnected && (
                            <Badge className="bg-green-500 text-white">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Connected
                            </Badge>
                                )}
                              </div>
                              
                              {isConnected && connection ? (
                                <>
                            <p className="text-sm text-muted-foreground mb-3">
                              @{connection.platform_username}
                            </p>
                            {/* Metrics Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Followers</p>
                                  <p className="text-sm font-bold">{connection.followers_count.toLocaleString()}</p>
                                  </div>
                              </div>
                              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Last Synced</p>
                                  <p className="text-sm font-medium">{formatRelativeTime(connection.last_synced_at)}</p>
                                </div>
                              </div>
                            </div>
                                </>
                              ) : (
                          <p className="text-sm text-muted-foreground mb-4">
                            {platform.description}
                          </p>
                              )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            {isConnected && connection ? (
                              <>
                                <Button
                                variant="outline" 
                                  size="sm"
                                className="flex-1"
                                  onClick={() => handleRefreshConnection(connection.id, platform.name)}
                                >
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Refresh
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                                  onClick={() => handleDisconnectSocial(connection.id, platform.name)}
                                >
                                  Disconnect
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                              className="w-full"
                                onClick={() => handleConnectSocial(platform.key)}
                                disabled={isConnecting}
                              >
                                {isConnecting ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Connecting...
                                  </>
                                ) : (
                                <>
                                  <Plus className="h-4 w-4 mr-2" />
                                  Connect Account
                                </>
                                )}
                              </Button>
                            )}
                        </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

          {/* Collapsible Advanced Settings */}
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            >
              <span className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Advanced Settings
              </span>
              {showAdvancedSettings ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>

            {showAdvancedSettings && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Settings
                    </CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={userDetail.profile?.avatar_url || ""} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {userDetail.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">@{username}</p>
                        <p className="text-sm text-muted-foreground">{email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="first-name-desktop" className="text-xs">First name</Label>
                        <Input 
                          id="first-name-desktop" 
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="last-name-desktop" className="text-xs">Last name</Label>
                        <Input 
                          id="last-name-desktop" 
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="h-9"
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={handleSaveProfile} 
                      disabled={saveLoading}
                      className="w-full"
                      size="sm"
                    >
                      {saveLoading ? "Saving..." : "Save Profile"}
                    </Button>
            </CardContent>
          </Card>

                {/* Security Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Security
                    </CardTitle>
                    <CardDescription>Change your password</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="current-password-desktop" className="text-xs">Current Password</Label>
                      <Input 
                        id="current-password-desktop" 
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="new-password-desktop" className="text-xs">New Password</Label>
                      <Input 
                        id="new-password-desktop" 
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="confirm-password-desktop" className="text-xs">Confirm Password</Label>
                      <Input 
                        id="confirm-password-desktop" 
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <Button 
                      onClick={handleChangePassword} 
                      disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                      className="w-full"
                      size="sm"
                    >
                      {passwordLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Notifications Settings */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notifications
                    </CardTitle>
                    <CardDescription>Manage your notification preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">Email Notifications</p>
                          <p className="text-xs text-muted-foreground">Get notified via email</p>
                        </div>
                        <Switch 
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">Performance Reports</p>
                          <p className="text-xs text-muted-foreground">Weekly analytics</p>
                        </div>
                        <Switch 
                          checked={postPerformanceReports}
                          onCheckedChange={setPostPerformanceReports}
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">AI Suggestions</p>
                          <p className="text-xs text-muted-foreground">Content recommendations</p>
                        </div>
                        <Switch 
                          checked={aiSuggestions}
                          onCheckedChange={setAiSuggestions}
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">Marketing Updates</p>
                          <p className="text-xs text-muted-foreground">Feature updates</p>
                        </div>
                        <Switch 
                          checked={marketingUpdates}
                          onCheckedChange={setMarketingUpdates}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button 
                        onClick={handleSaveNotifications}
                        disabled={saveLoading}
                        size="sm"
                      >
                        {saveLoading ? "Saving..." : "Save Preferences"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
        <div className="grid grid-cols-4 h-16">
          <button
            onClick={() => setActiveTab('social')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'social' 
                ? 'text-foreground border-t-2 border-foreground' 
                : 'text-muted-foreground'
            }`}
          >
            <Globe className="w-5 h-5" />
            <span className="text-xs font-medium">Social</span>
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'profile' 
                ? 'text-foreground border-t-2 border-foreground' 
                : 'text-muted-foreground'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs font-medium">Profile</span>
          </button>
          
          <button
            onClick={() => setActiveTab('security')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'security' 
                ? 'text-foreground border-t-2 border-foreground' 
                : 'text-muted-foreground'
            }`}
          >
            <Lock className="w-5 h-5" />
            <span className="text-xs font-medium">Security</span>
          </button>
          
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'notifications' 
                ? 'text-foreground border-t-2 border-foreground' 
                : 'text-muted-foreground'
            }`}
          >
            <Bell className="w-5 h-5" />
            <span className="text-xs font-medium">Notifications</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;