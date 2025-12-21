
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/UserDashboardLayout";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import PostComposer from "@/components/dashboard/PostComposer";
import UserPerformanceDashboard from "@/components/dashboard/UserPerformanceDashboard";
import RecentPostsFeed from "@/components/dashboard/RecentPostsFeed";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Calendar, Clock, Users, TrendingUp } from "lucide-react";

const UserDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("postpulse-authenticated");
    const isAdmin = localStorage.getItem("postpulse-admin") === "true";
    const storedUsername = localStorage.getItem("postpulse-username") || "";
    
    if (!auth) {
      navigate("/login");
    } else if (isAdmin) {
      navigate("/admin");
    } else {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 px-2 w-full max-w-full md:max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center">
          <WelcomeHeader username={username} role="user" />
          <ThemeToggle />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <Card className="stat-card border-l-4 border-l-primary bg-gradient-to-br from-blue-50/50 to-background dark:from-blue-950/20 dark:to-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Scheduled Posts</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">12</p>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      3
                    </span>
                  </div>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="stat-card border-l-4 border-l-green-500 bg-gradient-to-br from-green-50/50 to-background dark:from-green-950/20 dark:to-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Posts This Month</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">38</p>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      12%
                    </span>
                  </div>
                </div>
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="stat-card border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50/50 to-background dark:from-purple-950/20 dark:to-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Audience</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">2.4k</p>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      8%
                    </span>
                  </div>
                </div>
                <div className="bg-purple-500/10 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="stat-card border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50/50 to-background dark:from-amber-950/20 dark:to-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Avg. Engagement</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">18m</p>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      5%
                    </span>
                  </div>
                </div>
                <div className="bg-amber-500/10 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <PostComposer />
        
        <div className="w-full">
          <UserPerformanceDashboard />
        </div>
        
        <RecentPostsFeed />
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
