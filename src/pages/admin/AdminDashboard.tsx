
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, BarChart3, UsersRound, Settings2, TrendingUp, Activity, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { UserActivityCard } from "@/components/admin/UserActivityCard";
import { SystemHealthCard } from "@/components/admin/SystemHealthCard";
import { ApiUsageCard } from "@/components/admin/ApiUsageCard";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";
import userApi from "@/services/userApi";
import type { UserStats } from "@/types/subscription";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats | null>(null);
  
  useEffect(() => {
    loadStats();
  }, []);
  
  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await userApi.getUserStats();
      setStats(data);
    } catch (error) {
      console.error("Error loading stats:", error);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefresh = async () => {
    await loadStats();
    toast.success("Data refreshed successfully");
  };

  const userGrowthData = [
    { month: "Jan", users: 1200 },
    { month: "Feb", users: 1400 },
    { month: "Mar", users: 1600 },
    { month: "Apr", users: 1850 },
    { month: "May", users: 2100 },
    { month: "Jun", users: 2400 },
    { month: "Jul", users: 2650 },
  ];

  const apiUsageData = [
    { day: "Mon", calls: 1200 },
    { day: "Tue", calls: 1400 },
    { day: "Wed", calls: 1100 },
    { day: "Thu", calls: 1300 },
    { day: "Fri", calls: 1500 },
    { day: "Sat", calls: 800 },
    { day: "Sun", calls: 750 },
  ];

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of platform performance and user activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading} className="hover-lift">
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
          <ThemeToggle />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card border-l-4 border-l-primary bg-gradient-to-br from-blue-50/50 to-background dark:from-blue-950/20 dark:to-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <div className="flex items-baseline gap-2">
                  {loading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  ) : (
                    <p className="text-3xl font-bold">{stats?.total_users.toLocaleString() || 0}</p>
                  )}
                </div>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <UsersRound className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card border-l-4 border-l-green-500 bg-gradient-to-br from-green-50/50 to-background dark:from-green-950/20 dark:to-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <div className="flex items-baseline gap-2">
                  {loading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  ) : (
                    <p className="text-3xl font-bold">{stats?.active_users.toLocaleString() || 0}</p>
                  )}
                </div>
              </div>
              <div className="bg-green-500/10 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50/50 to-background dark:from-purple-950/20 dark:to-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Paid Subscribers</p>
                <div className="flex items-baseline gap-2">
                  {loading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  ) : (
                    <p className="text-3xl font-bold">{stats?.paid_subscribers.toLocaleString() || 0}</p>
                  )}
                </div>
              </div>
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50/50 to-background dark:from-amber-950/20 dark:to-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                <div className="flex items-baseline gap-2">
                  {loading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  ) : (
                    <p className="text-3xl font-bold">{stats?.total_posts.toLocaleString() || 0}</p>
                  )}
                </div>
              </div>
              <div className="bg-amber-500/10 p-3 rounded-lg">
                <Settings2 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 hover-lift">
          <CardHeader className="pb-4">
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly user acquisition trend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="pb-4">
            <CardTitle>System Health</CardTitle>
            <CardDescription>Current system status</CardDescription>
          </CardHeader>
          <CardContent>
            <SystemHealthCard />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 hover-lift">
          <CardHeader className="pb-4">
            <CardTitle>API Usage</CardTitle>
            <CardDescription>Weekly API call volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={apiUsageData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Bar dataKey="calls" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="pb-4">
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest user actions</CardDescription>
          </CardHeader>
          <CardContent>
            <UserActivityCard />
          </CardContent>
        </Card>
      </div>

      <Card className="hover-lift">
        <CardHeader className="pb-4">
          <CardTitle>API Services Status</CardTitle>
          <CardDescription>Monitor available services</CardDescription>
        </CardHeader>
        <CardContent>
          <ApiUsageCard />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
