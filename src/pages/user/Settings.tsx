import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Lock, Bell, Loader2, Mail, Calendar, Activity, PenSquare, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import userApi from "@/services/userApi";
import type { UserDetail } from "@/types/user";
import AnimatedPage from "@/components/animations/AnimatedPage";
import AnimatedCard from "@/components/animations/AnimatedCard";
import { motion } from "framer-motion";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'security' | 'notifications'>('profile');
  const [loading, setLoading] = useState(true);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
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
  
  // Load user data on mount
  useEffect(() => {
    loadUserData();
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
      
      toast.success("Profile updated successfully");
      await loadUserData();
      setIsEditingProfile(false);
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

  const handleCancelEdit = () => {
    if (userDetail) {
      setFirstName(userDetail.first_name);
      setLastName(userDetail.last_name);
      setEmail(userDetail.email);
      setBio(userDetail.profile?.bio || "");
    }
    setIsEditingProfile(false);
  };

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
    <AnimatedPage>
      <div className="min-h-screen bg-background pb-20 md:pb-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 p-4 md:p-6">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">Settings & Profile</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 md:px-6 space-y-4 md:space-y-6">
          {/* Mobile: Tab Content */}
          <div className="md:hidden space-y-4">
            {activeTab === 'profile' && (
              <AnimatedCard>
                <Card className="border-l-4 border-l-primary shadow-sm">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg">Profile</CardTitle>
                        <CardDescription className="text-xs">Your personal information</CardDescription>
                      </div>
                      {!isEditingProfile && (
                        <Button onClick={() => setIsEditingProfile(true)} size="sm" variant="ghost">
                          <PenSquare className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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
                        {isEditingProfile && (
                          <Button 
                            size="icon" 
                            variant="secondary" 
                            className="absolute bottom-0 right-0 rounded-full h-7 w-7"
                            onClick={() => document.getElementById('avatar-upload')?.click()}
                          >
                            <PenSquare size={12} />
                          </Button>
                        )}
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

                    {isEditingProfile ? (
                      <div className="space-y-3">
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
                          <Label htmlFor="email" className="text-xs">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="bio" className="text-xs">Bio</Label>
                          <Textarea 
                            id="bio" 
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about yourself"
                            rows={3}
                            className="text-sm resize-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline"
                            onClick={handleCancelEdit}
                            className="flex-1 h-9"
                            disabled={saveLoading}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleSaveProfile} 
                            disabled={saveLoading}
                            className="flex-1 h-9"
                          >
                            {saveLoading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-1" />
                                Save
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Full Name</p>
                            <p className="font-medium">{firstName} {lastName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Email</p>
                            <p className="font-medium">{email}</p>
                          </div>
                        </div>
                        {bio && (
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Bio</p>
                            <p className="text-sm">{bio}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AnimatedCard>
            )}

            {activeTab === 'account' && (
              <AnimatedCard delay={0.1}>
                <Card className="border-l-4 border-l-blue-500 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Account Information</CardTitle>
                    <CardDescription className="text-xs">Your account details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Username</p>
                        <p className="font-medium text-sm">@{username}</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Status</p>
                        <p className="font-medium text-sm text-green-600">Active</p>
                      </div>
                      <div className="col-span-2 p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Member Since</p>
                        <p className="font-medium text-sm">
                          {new Date(userDetail.date_joined).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedCard>
            )}

            {activeTab === 'security' && (
              <AnimatedCard delay={0.1}>
                <Card className="border-l-4 border-l-amber-500 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Security Settings</CardTitle>
                    <CardDescription className="text-xs">Manage your account security</CardDescription>
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
                        className="w-full h-9"
                      >
                        {passwordLoading ? "Updating..." : "Update Password"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedCard>
            )}

            {activeTab === 'notifications' && (
              <AnimatedCard delay={0.1}>
                <Card className="border-l-4 border-l-green-500 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Notification Settings</CardTitle>
                    <CardDescription className="text-xs">Choose what you want to be notified about</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <motion.div 
                        className="flex items-center justify-between py-2 border-b"
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">Email Notifications</p>
                          <p className="text-xs text-muted-foreground">Get notified via email</p>
                        </div>
                        <Switch 
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                        />
                      </motion.div>
                      <motion.div 
                        className="flex items-center justify-between py-2 border-b"
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">Performance Reports</p>
                          <p className="text-xs text-muted-foreground">Weekly analytics reports</p>
                        </div>
                        <Switch 
                          checked={postPerformanceReports}
                          onCheckedChange={setPostPerformanceReports}
                        />
                      </motion.div>
                      <motion.div 
                        className="flex items-center justify-between py-2 border-b"
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">AI Suggestions</p>
                          <p className="text-xs text-muted-foreground">Content recommendations</p>
                        </div>
                        <Switch 
                          checked={aiSuggestions}
                          onCheckedChange={setAiSuggestions}
                        />
                      </motion.div>
                      <motion.div 
                        className="flex items-center justify-between py-2"
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">Marketing Updates</p>
                          <p className="text-xs text-muted-foreground">Feature updates and offers</p>
                        </div>
                        <Switch 
                          checked={marketingUpdates}
                          onCheckedChange={setMarketingUpdates}
                        />
                      </motion.div>
                    </div>
                    <Button 
                      onClick={handleSaveNotifications}
                      disabled={saveLoading}
                      className="w-full h-9"
                    >
                      {saveLoading ? "Saving..." : "Save Preferences"}
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedCard>
            )}
          </div>

          {/* Desktop: Grid Layout */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <AnimatedCard className="md:col-span-1">
              <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile
                    </CardTitle>
                    {!isEditingProfile && (
                      <Button onClick={() => setIsEditingProfile(true)} size="sm" variant="ghost">
                        <PenSquare className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={userDetail.profile?.avatar_url || ""} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                          {userDetail.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {isEditingProfile && (
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="absolute bottom-0 right-0 rounded-full h-7 w-7"
                          onClick={() => document.getElementById('avatar-upload-desktop')?.click()}
                        >
                          <PenSquare size={12} />
                        </Button>
                      )}
                      <input 
                        type="file" 
                        id="avatar-upload-desktop" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileUpload}
                      />
                    </div>
                    <h3 className="font-bold text-lg">@{username}</h3>
                    <p className="text-sm text-muted-foreground">{email}</p>
                  </div>

                  {isEditingProfile ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
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
                      <div className="space-y-1.5">
                        <Label htmlFor="bio-desktop" className="text-xs">Bio</Label>
                        <Textarea 
                          id="bio-desktop" 
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Tell us about yourself"
                          rows={3}
                          className="text-sm resize-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEdit}
                          className="flex-1"
                          disabled={saveLoading}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                        <Button 
                          size="sm"
                          onClick={handleSaveProfile} 
                          disabled={saveLoading}
                          className="flex-1"
                        >
                          {saveLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      {bio && (
                        <p className="text-center text-muted-foreground">{bio}</p>
                      )}
                      <div className="pt-2 space-y-2">
                        <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                          <span className="text-xs text-muted-foreground">Member Since</span>
                          <span className="font-medium text-xs">
                            {new Date(userDetail.date_joined).toLocaleDateString('en-US', { 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </AnimatedCard>

            {/* Right Column */}
            <div className="md:col-span-2 space-y-6">
              {/* Security Settings */}
              <AnimatedCard delay={0.1}>
                <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Security
                    </CardTitle>
                    <CardDescription>Change your password</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-3">
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
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button 
                        onClick={handleChangePassword} 
                        disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                        size="sm"
                      >
                        {passwordLoading ? "Updating..." : "Update Password"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedCard>

              {/* Notifications Settings */}
              <AnimatedCard delay={0.2}>
                <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notifications
                    </CardTitle>
                    <CardDescription>Manage your notification preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div 
                        className="flex items-center justify-between p-3 border rounded-lg"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">Email Notifications</p>
                          <p className="text-xs text-muted-foreground">Get notified via email</p>
                        </div>
                        <Switch 
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                        />
                      </motion.div>
                      <motion.div 
                        className="flex items-center justify-between p-3 border rounded-lg"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">Performance Reports</p>
                          <p className="text-xs text-muted-foreground">Weekly analytics</p>
                        </div>
                        <Switch 
                          checked={postPerformanceReports}
                          onCheckedChange={setPostPerformanceReports}
                        />
                      </motion.div>
                      <motion.div 
                        className="flex items-center justify-between p-3 border rounded-lg"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">AI Suggestions</p>
                          <p className="text-xs text-muted-foreground">Content recommendations</p>
                        </div>
                        <Switch 
                          checked={aiSuggestions}
                          onCheckedChange={setAiSuggestions}
                        />
                      </motion.div>
                      <motion.div 
                        className="flex items-center justify-between p-3 border rounded-lg"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">Marketing Updates</p>
                          <p className="text-xs text-muted-foreground">Feature updates</p>
                        </div>
                        <Switch 
                          checked={marketingUpdates}
                          onCheckedChange={setMarketingUpdates}
                        />
                      </motion.div>
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
              </AnimatedCard>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Tab Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
          <div className="grid grid-cols-4 h-16">
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
              onClick={() => setActiveTab('account')}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                activeTab === 'account' 
                  ? 'text-foreground border-t-2 border-foreground' 
                  : 'text-muted-foreground'
              }`}
            >
              <Activity className="w-5 h-5" />
              <span className="text-xs font-medium">Account</span>
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
    </AnimatedPage>
  );
};

export default Settings;
