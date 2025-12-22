import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Calendar, Activity, Loader2, PenSquare, Save, X } from "lucide-react";
import { toast } from "sonner";
import userApi from "@/services/userApi";
import type { UserDetail } from "@/types/user";
import { Label } from "@/components/ui/label";

const UserProfile = () => {
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  
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
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving personal info:", error);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form to original values
    if (userDetail) {
      setFirstName(userDetail.first_name);
      setLastName(userDetail.last_name);
      setEmail(userDetail.email);
      setBio(userDetail.profile?.bio || "");
    }
    setIsEditing(false);
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 p-4 md:p-6">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">View and manage your profile information</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} size="sm" className="gap-2">
            <PenSquare className="h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 px-4 md:px-6 pb-4 md:pb-6">
        <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
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
        
        <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
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
        
        <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
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
        
        <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
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
      <div className="px-4 md:px-6 pb-6 space-y-4 md:space-y-6">
        {!isEditing ? (
          /* View Mode */
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {/* Profile Card */}
            <Card className="border-l-4 border-l-primary shadow-sm md:col-span-1">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 md:w-32 md:h-32 mb-4">
                  <AvatarImage src={userDetail.profile?.avatar_url || ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                    {userDetail.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl md:text-2xl font-bold">{userDetail.profile?.full_name || userDetail.username}</h2>
                <p className="text-muted-foreground">@{userDetail.username}</p>
                {userDetail.profile?.bio && (
                  <p className="text-sm mt-4 text-muted-foreground">{userDetail.profile.bio}</p>
                )}
              </CardContent>
            </Card>

            {/* Information Card */}
            <Card className="shadow-sm md:col-span-2">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Email Address</p>
                      <p className="font-medium truncate">{userDetail.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <div className="bg-green-500/10 p-3 rounded-lg">
                      <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Username</p>
                      <p className="font-medium truncate">@{userDetail.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <div className="bg-purple-500/10 p-3 rounded-lg">
                      <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Member Since</p>
                      <p className="font-medium">
                        {new Date(userDetail.date_joined).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <div className="bg-amber-500/10 p-3 rounded-lg">
                      <Activity className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Account Status</p>
                      <p className="font-medium capitalize">
                        <span className="text-green-600 dark:text-green-400">
                          {userDetail.profile?.status || 'Active'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Edit Mode */
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {/* Avatar Card */}
            <Card className="border-l-4 border-l-primary shadow-sm md:col-span-1">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 md:w-32 md:h-32 mb-4">
                  <AvatarImage src={userDetail.profile?.avatar_url || ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                    {userDetail.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-bold mb-2">Profile Picture</h3>
                <Button variant="outline" size="sm" className="w-full">
                  <PenSquare className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
              </CardContent>
            </Card>

            {/* Edit Form */}
            <Card className="shadow-sm md:col-span-2">
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Tell us about yourself" 
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="flex-1 gap-2"
                    disabled={saving}
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSavePersonalInfo}
                    disabled={saving}
                    className="flex-1 gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
