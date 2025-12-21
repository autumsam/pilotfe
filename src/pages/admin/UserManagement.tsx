import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Search, Filter, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BulkUserActions } from "@/components/admin/BulkUserActions";
import { AddUserDialog } from "@/components/admin/AddUserDialog";
import { UserDetailsDropdown } from "@/components/admin/UserDetailsDropdown";
import userApi from "@/services/userApi";
import type { UserDetail } from "@/types/user";
import type { UserDetailedInfo } from "@/types/subscription";

interface UserWithDetails extends UserDetail {
  subscription?: {
    tier: 'free' | 'starter' | 'professional' | 'enterprise';
    status: string;
  };
  lastLogin?: string;
  detailedInfo?: UserDetailedInfo;
}

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  
  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, []);
  
  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await userApi.getAllUsers();
      
      // Fetch detailed info for each user
      const detailedUsers = await Promise.all(
        allUsers.map(async (user) => {
          try {
            const details = await userApi.getUser(user.id);
            const detailedInfo = await userApi.getUserDetailedInfo(user.id);
            
            return {
              ...details,
              subscription: detailedInfo.subscription ? {
                tier: detailedInfo.subscription.tier,
                status: detailedInfo.subscription.status,
              } : undefined,
              lastLogin: detailedInfo.last_login 
                ? formatLastActive(detailedInfo.last_login)
                : "Never",
              detailedInfo,
            };
          } catch (error) {
            console.error(`Error loading user ${user.id}:`, error);
            return null;
          }
        })
      );
      
      setUsers(detailedUsers.filter((u): u is UserWithDetails => u !== null));
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };
  
  const formatLastActive = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  const handleRefresh = async () => {
    await loadUsers();
    toast.success("User data refreshed");
  };

  const handleUserAdded = async () => {
    await loadUsers();
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(filteredUsers.map(u => u.id));
  };

  const handleClearSelection = () => {
    setSelectedUsers([]);
  };

  const handleBulkAction = async (action: string, userIds: number[]) => {
    try {
      setLoading(true);
      
      if (action === "suspend") {
        await userApi.bulkUpdateUsers(userIds, 'suspend');
        toast.success(`${userIds.length} user(s) suspended`);
      } else if (action === "activate") {
        await userApi.bulkUpdateUsers(userIds, 'activate');
        toast.success(`${userIds.length} user(s) activated`);
      } else if (action === "delete") {
        await userApi.bulkUpdateUsers(userIds, 'delete');
        toast.success(`${userIds.length} user(s) deleted`);
      }
      
      setSelectedUsers([]);
      await loadUsers();
    } catch (error) {
      console.error("Error performing bulk action:", error);
      toast.error("Failed to perform bulk action");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSuspendUser = async (userId: number) => {
    try {
      setActionLoading(userId);
      await userApi.suspendUser(userId);
      toast.success("User suspended successfully");
      await loadUsers();
    } catch (error) {
      console.error("Error suspending user:", error);
      toast.error("Failed to suspend user");
    } finally {
      setActionLoading(null);
    }
  };
  
  const handleActivateUser = async (userId: number) => {
    try {
      setActionLoading(userId);
      await userApi.activateUser(userId);
      toast.success("User activated successfully");
      await loadUsers();
    } catch (error) {
      console.error("Error activating user:", error);
      toast.error("Failed to activate user");
    } finally {
      setActionLoading(null);
    }
  };
  
  const handleUpdateRole = async (userId: number, newRole: 'admin' | 'moderator' | 'user') => {
    try {
      setActionLoading(userId);
      await userApi.updateUserRole(userId, newRole);
      toast.success("User role updated successfully");
      await loadUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    } finally {
      setActionLoading(null);
    }
  };
  
  const handleUpdateSubscription = async (
    userId: number,
    newTier: 'free' | 'starter' | 'professional' | 'enterprise'
  ) => {
    try {
      setActionLoading(userId);
      await userApi.changeUserSubscription(userId, newTier);
      toast.success("Subscription tier updated successfully");
      await loadUsers();
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error("Failed to update subscription tier");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.profile?.full_name || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const userRole = user.role?.role || (user.is_staff ? "admin" : "user");
    const matchesRole = filterRole === "all" || userRole === filterRole;
    
    const userStatus = user.profile?.status || (user.is_active ? "active" : "inactive");
    const matchesStatus = filterStatus === "all" || userStatus === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <AddUserDialog onUserAdded={handleUserAdded} />
          <ThemeToggle />
        </div>
      </div>

      {/* Bulk Actions */}
      <BulkUserActions
        users={filteredUsers}
        selectedUsers={selectedUsers}
        onSelectUser={handleSelectUser}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
        onBulkAction={handleBulkAction}
      />

      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
          <CardDescription>View and manage all user accounts on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onCheckedChange={() => {
                        if (selectedUsers.length === filteredUsers.length) {
                          handleClearSelection();
                        } else {
                          handleSelectAll();
                        }
                      }}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Name & Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Accounts
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const userRole = user.role?.role || (user.is_staff ? "admin" : "user");
                    const userStatus = user.profile?.status || (user.is_active ? "active" : "inactive");
                    const subscriptionTier = user.subscription?.tier || 'free';
                    const isLoading = actionLoading === user.id;
                    const socialAccountsCount = user.detailedInfo?.social_connections.length || 0;
                    
                    return (
                      <tr key={user.id} className={selectedUsers.includes(user.id) ? "bg-primary/5" : ""}>
                        <td className="px-4 py-4">
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={() => handleSelectUser(user.id)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium">
                                {user.profile?.full_name || user.username}
                              </div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <Select
                              value={userRole}
                              onValueChange={(value) => handleUpdateRole(user.id, value as 'admin' | 'moderator' | 'user')}
                              disabled={isLoading}
                            >
                              <SelectTrigger className={`w-[120px] ${
                                userRole === "admin" 
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 border-purple-300" 
                                  : userRole === "moderator"
                                    ? "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 border-orange-300"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border-blue-300"
                              }`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="moderator">Moderator</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <Select
                              value={subscriptionTier}
                              onValueChange={(value) => handleUpdateSubscription(user.id, value as 'free' | 'starter' | 'professional' | 'enterprise')}
                              disabled={isLoading}
                            >
                              <SelectTrigger className={`w-[140px] ${
                                subscriptionTier === "enterprise" 
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 border-amber-300"
                                  : subscriptionTier === "professional"
                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 border-purple-300"
                                    : subscriptionTier === "starter"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border-blue-300"
                                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300 border-gray-300"
                              }`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="free">Free</SelectItem>
                                <SelectItem value="starter">Starter</SelectItem>
                                <SelectItem value="professional">Professional</SelectItem>
                                <SelectItem value="enterprise">Enterprise</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              userStatus === "active" 
                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300" 
                                : userStatus === "suspended"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                            }`}>
                              {userStatus.charAt(0).toUpperCase() + userStatus.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {new Date(user.date_joined).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {user.lastLogin || "Never"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                            {socialAccountsCount} connected
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <UserDetailsDropdown userId={user.id} username={user.username} />
                            {user.is_active && userStatus === "active" ? (
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleSuspendUser(user.id)}
                                disabled={isLoading}
                              >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Suspend"}
                              </Button>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                                onClick={() => handleActivateUser(user.id)}
                                disabled={isLoading}
                              >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Activate"}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            
            {filteredUsers.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No users found matching your filters</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{filteredUsers.length}</span> of{" "}
              <span className="font-medium">{users.length}</span> users
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
