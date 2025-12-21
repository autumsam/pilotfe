import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { User, Mail, Calendar, Activity, Loader2, Globe, MapPin, Briefcase } from "lucide-react";
import { toast } from "sonner";
import userApi from "@/services/userApi";
import type { UserDetail } from "@/types/user";
import { Label } from "@/components/ui/label";

const UserProfile = () => {
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'edit'>('overview');
  
  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  
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
      setFirstName(data.first_name);
      setLastName(data.last_name);
      setEmail(data.email);
      setBio(data.profile?.bio || "");
      setLocation(data.profile?.location || "");
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSavePersonalInfo = async () => {
    try {
      setSaving(true);
      
      // Update basic user info
      await userApi.updateCurrentUser({
        first_name: firstName,
        last_name: lastName,
        email: email,
      });
      
      // Update profile bio
      if (userDetail?.profile) {
        await userApi.updateCurrentProfile({
          bio: bio,
          full_name: `${firstName} ${lastName}`.trim(),
        });
      }
      
      toast.success("Profile updated successfully");
      await loadUserData();
      setActiveTab('overview');
    } catch (error) {
      console.error("Error saving personal info:", error);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
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
        <p className="text-muted-foreground">Failed to load profile</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Header - Desktop only */}
      <div className="hidden md:flex justify-between items-center p-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">My Profile</h1>
          <p className="text-muted-foreground mt-1">View and manage your profile information</p>
        </div>
        <ThemeToggle />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 p-4 md:p-6">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Total Posts</p>
                <p className="text-2xl md:text-3xl font-bold">0</p>
              </div>
              <div className="bg-primary/10 p-2 md:p-3 rounded-lg">
                <Activity className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Followers</p>
                <p className="text-2xl md:text-3xl font-bold">0</p>
              </div>
              <div className="bg-green-500/10 p-2 md:p-3 rounded-lg">
                <User className="h-5 w-5 md:h-6 md:w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Engagement</p>
                <p className="text-2xl md:text-3xl font-bold">0%</p>
              </div>
              <div className="bg-purple-500/10 p-2 md:p-3 rounded-lg">
                <Activity className="h-5 w-5 md:h-6 md:w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Member Since</p>
                <p className="text-sm md:text-base font-bold">
                  {new Date(userDetail.date_joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div className="bg-amber-500/10 p-2 md:p-3 rounded-lg">
                <Calendar className="h-5 w-5 md:h-6 md:w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-6 space-y-4">
        {/* Mobile: Tab Content */}
        <div className="md:hidden space-y-4">
          {activeTab === 'overview' && (
            <>
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src={userDetail.profile?.avatar_url || ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {userDetail.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{userDetail.profile?.full_name || userDetail.username}</h2>
                  <p className="text-sm text-muted-foreground">@{userDetail.username}</p>
                  {userDetail.profile?.bio && (
                    <p className="text-sm mt-3 text-muted-foreground">{userDetail.profile.bio}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">{userDetail.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Full Name</p>
                      <p className="text-sm font-medium">{`${userDetail.first_name} ${userDetail.last_name}`}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="text-sm font-medium capitalize">
                        {userDetail.profile?.status || 'Active'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'edit' && (
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center mb-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={userDetail.profile?.avatar_url || ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {userDetail.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="firstName" className="text-xs">First Name</Label>
                      <Input 
                        id="firstName" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lastName" className="text-xs">Last Name</Label>
                      <Input 
                        id="lastName" 
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
                      placeholder="Write a short bio about yourself" 
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => setActiveTab('overview')}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSavePersonalInfo}
                      disabled={saving}
                      className="flex-1"
                    >
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Avatar className="w-32 h-32 mb-4">
                <AvatarImage src={userDetail.profile?.avatar_url || ""} />
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                  {userDetail.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{userDetail.profile?.full_name || userDetail.username}</h2>
              <p className="text-muted-foreground">@{userDetail.username}</p>
              {userDetail.profile?.bio && (
                <p className="text-sm mt-4 text-muted-foreground">{userDetail.profile.bio}</p>
              )}
              <Button className="mt-6 w-full">Change Photo</Button>
            </CardContent>
          </Card>

          {/* Information Cards */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName-desktop">First Name</Label>
                    <Input 
                      id="firstName-desktop" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName-desktop">Last Name</Label>
                    <Input 
                      id="lastName-desktop" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-desktop">Email</Label>
                  <Input 
                    id="email-desktop" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio-desktop">Bio</Label>
                  <Textarea 
                    id="bio-desktop" 
                    placeholder="Write a short bio about yourself" 
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSavePersonalInfo}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>Information about your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Email Address</p>
                    <p className="font-medium">{userDetail.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <div className="bg-green-500/10 p-3 rounded-lg">
                    <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="font-medium">@{userDetail.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <div className="bg-purple-500/10 p-3 rounded-lg">
                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">
                      {new Date(userDetail.date_joined).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <div className="bg-amber-500/10 p-3 rounded-lg">
                    <Activity className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Account Status</p>
                    <p className="font-medium capitalize">
                      <span className="text-green-600 dark:text-green-400">
                        {userDetail.profile?.status || 'Active'}
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
        <div className="grid grid-cols-2 h-16">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'overview' 
                ? 'text-foreground border-t-2 border-foreground' 
                : 'text-muted-foreground'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs font-medium">Overview</span>
          </button>
          
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'edit' 
                ? 'text-foreground border-t-2 border-foreground' 
                : 'text-muted-foreground'
            }`}
          >
            <Activity className="w-5 h-5" />
            <span className="text-xs font-medium">Edit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
