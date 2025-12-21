import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  Bell, 
  BellOff, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle,
  X,
  Settings,
  Zap,
  Server,
  Users,
  Shield
} from "lucide-react";

export interface Alert {
  id: string;
  type: "critical" | "warning" | "info" | "success";
  title: string;
  message: string;
  timestamp: Date;
  category: "api" | "user" | "system" | "security";
  read: boolean;
}

interface AlertsPanelProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
  onDismissAll: () => void;
  onMarkAsRead: (id: string) => void;
}

const getAlertIcon = (type: string, category: string) => {
  if (category === "api") return <Zap className="h-4 w-4" />;
  if (category === "system") return <Server className="h-4 w-4" />;
  if (category === "user") return <Users className="h-4 w-4" />;
  if (category === "security") return <Shield className="h-4 w-4" />;
  
  switch (type) {
    case "critical":
      return <AlertCircle className="h-4 w-4" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4" />;
    case "success":
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

const getAlertStyles = (type: string) => {
  switch (type) {
    case "critical":
      return "border-l-red-500 bg-red-50/50 dark:bg-red-950/20";
    case "warning":
      return "border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20";
    case "success":
      return "border-l-green-500 bg-green-50/50 dark:bg-green-950/20";
    default:
      return "border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20";
  }
};

const getIconColor = (type: string) => {
  switch (type) {
    case "critical":
      return "text-red-600 bg-red-100 dark:bg-red-900/30";
    case "warning":
      return "text-amber-600 bg-amber-100 dark:bg-amber-900/30";
    case "success":
      return "text-green-600 bg-green-100 dark:bg-green-900/30";
    default:
      return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
  }
};

export const AlertsPanel = ({ alerts, onDismiss, onDismissAll, onMarkAsRead }: AlertsPanelProps) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Real-time Alerts</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </div>
          {alerts.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onDismissAll}>
              Clear All
            </Button>
          )}
        </div>
        <CardDescription>
          System notifications and critical events
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          {alerts.length > 0 ? (
            <div className="space-y-2 p-4 pt-0">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`relative border-l-4 rounded-lg p-3 transition-all ${getAlertStyles(alert.type)} ${!alert.read ? "ring-1 ring-primary/20" : "opacity-80"}`}
                  onClick={() => onMarkAsRead(alert.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getIconColor(alert.type)}`}>
                      {getAlertIcon(alert.type, alert.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-medium text-sm truncate">{alert.title}</h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDismiss(alert.id);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {alert.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(alert.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <BellOff className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">No alerts</p>
              <p className="text-xs text-muted-foreground mt-1">
                You're all caught up!
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// Alert Settings Component
export const AlertSettings = () => {
  const [settings, setSettings] = useState({
    apiFailures: true,
    securityEvents: true,
    userActivity: false,
    systemHealth: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success("Alert settings updated");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Alert Preferences</CardTitle>
        </div>
        <CardDescription>
          Configure which events trigger notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="font-medium text-sm">API Failures</p>
            <p className="text-xs text-muted-foreground">
              Alert when API calls fail or timeout
            </p>
          </div>
          <Switch
            checked={settings.apiFailures}
            onCheckedChange={() => handleToggle("apiFailures")}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="font-medium text-sm">Security Events</p>
            <p className="text-xs text-muted-foreground">
              Failed logins, suspicious activity
            </p>
          </div>
          <Switch
            checked={settings.securityEvents}
            onCheckedChange={() => handleToggle("securityEvents")}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="font-medium text-sm">User Activity Spikes</p>
            <p className="text-xs text-muted-foreground">
              Unusual traffic or registration patterns
            </p>
          </div>
          <Switch
            checked={settings.userActivity}
            onCheckedChange={() => handleToggle("userActivity")}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="font-medium text-sm">System Health</p>
            <p className="text-xs text-muted-foreground">
              Server load, memory, disk space
            </p>
          </div>
          <Switch
            checked={settings.systemHealth}
            onCheckedChange={() => handleToggle("systemHealth")}
          />
        </div>
      </CardContent>
    </Card>
  );
};