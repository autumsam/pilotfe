import { useState, useEffect } from "react";
import AdminLayout from "@/components/dashboard/AdminLayout";
import { AlertsPanel, AlertSettings, Alert } from "@/components/admin/AlertsPanel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Bell, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";

// Mock alerts generator
const generateMockAlerts = (): Alert[] => {
  const now = new Date();
  return [
    {
      id: "1",
      type: "critical",
      title: "API Rate Limit Exceeded",
      message: "Twitter API has exceeded 80% of daily rate limit",
      timestamp: new Date(now.getTime() - 1000 * 60 * 2),
      category: "api",
      read: false,
    },
    {
      id: "2",
      type: "warning",
      title: "Failed Login Attempts",
      message: "5 failed login attempts from IP 45.33.32.156",
      timestamp: new Date(now.getTime() - 1000 * 60 * 10),
      category: "security",
      read: false,
    },
    {
      id: "3",
      type: "info",
      title: "New User Spike",
      message: "15 new registrations in the last hour (200% above average)",
      timestamp: new Date(now.getTime() - 1000 * 60 * 25),
      category: "user",
      read: true,
    },
    {
      id: "4",
      type: "warning",
      title: "High Server Load",
      message: "CPU usage at 85% - consider scaling resources",
      timestamp: new Date(now.getTime() - 1000 * 60 * 45),
      category: "system",
      read: true,
    },
    {
      id: "5",
      type: "success",
      title: "Backup Completed",
      message: "Daily database backup completed successfully",
      timestamp: new Date(now.getTime() - 1000 * 60 * 60),
      category: "system",
      read: true,
    },
    {
      id: "6",
      type: "critical",
      title: "Instagram API Error",
      message: "Instagram API returning 500 errors for post publishing",
      timestamp: new Date(now.getTime() - 1000 * 60 * 90),
      category: "api",
      read: true,
    },
  ];
};

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>(generateMockAlerts());
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Simulate new alert
      const newAlert: Alert = {
        id: Date.now().toString(),
        type: "info",
        title: "System Update",
        message: "New features have been deployed to production",
        timestamp: new Date(),
        category: "system",
        read: false,
      };
      setAlerts(prev => [newAlert, ...prev]);
      toast.success("Alerts refreshed - 1 new alert");
    }, 800);
  };

  const handleDismiss = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleDismissAll = () => {
    setAlerts([]);
    toast.success("All alerts cleared");
  };

  const handleMarkAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, read: true } : a
    ));
  };

  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.type === "critical").length,
    warning: alerts.filter(a => a.type === "warning").length,
    unread: alerts.filter(a => !a.read).length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
              Real-time Alerts
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor critical events and system notifications
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50/50 to-background dark:from-blue-950/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Alerts</p>
                </div>
                <Bell className="h-8 w-8 text-blue-500/30" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-50/50 to-background dark:from-red-950/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
                  <p className="text-xs text-muted-foreground">Critical</p>
                </div>
                {stats.critical > 0 && (
                  <Badge variant="destructive" className="animate-pulse">
                    Action Needed
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50/50 to-background dark:from-amber-950/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-amber-600">{stats.warning}</p>
                  <p className="text-xs text-muted-foreground">Warnings</p>
                </div>
                <TrendingUp className="h-8 w-8 text-amber-500/30" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50/50 to-background dark:from-green-950/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">{stats.unread}</p>
                  <p className="text-xs text-muted-foreground">Unread</p>
                </div>
                <TrendingDown className="h-8 w-8 text-green-500/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AlertsPanel
              alerts={alerts}
              onDismiss={handleDismiss}
              onDismissAll={handleDismissAll}
              onMarkAsRead={handleMarkAsRead}
            />
          </div>
          <div>
            <AlertSettings />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Alerts;