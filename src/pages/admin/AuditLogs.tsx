import { useState } from "react";
import AdminLayout from "@/components/dashboard/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuditLogEntry, AuditLog } from "@/components/admin/AuditLogEntry";
import { 
  Search, 
  Download, 
  RefreshCw, 
  Filter,
  FileText,
  Shield,
  Users,
  Settings
} from "lucide-react";
import { toast } from "sonner";

// Mock audit log data
const generateMockLogs = (): AuditLog[] => {
  const now = new Date();
  return [
    {
      id: "1",
      timestamp: new Date(now.getTime() - 1000 * 60 * 5),
      action: "user_created",
      actionType: "user",
      actor: "Admin John",
      target: "sarah@example.com",
      details: "created new user",
      severity: "info",
      ip: "192.168.1.100",
    },
    {
      id: "2",
      timestamp: new Date(now.getTime() - 1000 * 60 * 15),
      action: "login_failed",
      actionType: "security",
      actor: "unknown@hacker.com",
      details: "failed login attempt (3rd attempt)",
      severity: "warning",
      ip: "45.33.32.156",
    },
    {
      id: "3",
      timestamp: new Date(now.getTime() - 1000 * 60 * 30),
      action: "role_changed",
      actionType: "user",
      actor: "Admin Jane",
      target: "mike@example.com",
      details: "changed role to Admin for",
      severity: "critical",
      ip: "192.168.1.105",
    },
    {
      id: "4",
      timestamp: new Date(now.getTime() - 1000 * 60 * 45),
      action: "settings_updated",
      actionType: "settings",
      actor: "Admin John",
      details: "updated system email settings",
      severity: "info",
      ip: "192.168.1.100",
    },
    {
      id: "5",
      timestamp: new Date(now.getTime() - 1000 * 60 * 60),
      action: "user_suspended",
      actionType: "user",
      actor: "Admin Jane",
      target: "spammer@example.com",
      details: "suspended user",
      severity: "warning",
      ip: "192.168.1.105",
    },
    {
      id: "6",
      timestamp: new Date(now.getTime() - 1000 * 60 * 90),
      action: "api_key_generated",
      actionType: "security",
      actor: "Admin John",
      details: "generated new API key for Twitter integration",
      severity: "warning",
      ip: "192.168.1.100",
    },
    {
      id: "7",
      timestamp: new Date(now.getTime() - 1000 * 60 * 120),
      action: "user_activated",
      actionType: "user",
      actor: "System",
      target: "newuser@example.com",
      details: "automatically activated",
      severity: "info",
    },
    {
      id: "8",
      timestamp: new Date(now.getTime() - 1000 * 60 * 180),
      action: "user_deleted",
      actionType: "user",
      actor: "Admin Jane",
      target: "olduser@example.com",
      details: "permanently deleted user",
      severity: "critical",
      ip: "192.168.1.105",
    },
  ];
};

const AuditLogs = () => {
  const [logs] = useState<AuditLog[]>(generateMockLogs());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Logs refreshed");
    }, 800);
  };

  const handleExport = () => {
    toast.success("Audit logs exported to CSV");
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.target?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    
    const matchesType = filterType === "all" || log.actionType === filterType;
    const matchesSeverity = filterSeverity === "all" || log.severity === filterSeverity;

    return matchesSearch && matchesType && matchesSeverity;
  });

  const stats = {
    total: logs.length,
    user: logs.filter(l => l.actionType === "user").length,
    security: logs.filter(l => l.actionType === "security").length,
    critical: logs.filter(l => l.severity === "critical").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
              Audit Logs
            </h1>
            <p className="text-muted-foreground mt-1">
              Track all administrative actions and system events
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50/50 to-background dark:from-blue-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50/50 to-background dark:from-green-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/10 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.user}</p>
                  <p className="text-xs text-muted-foreground">User Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50/50 to-background dark:from-amber-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500/10 p-2 rounded-lg">
                  <Shield className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.security}</p>
                  <p className="text-xs text-muted-foreground">Security Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-50/50 to-background dark:from-red-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-500/10 p-2 rounded-lg">
                  <Settings className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.critical}</p>
                  <p className="text-xs text-muted-foreground">Critical Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs by actor, action, or target..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="settings">Settings</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Logs List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Activity Log</CardTitle>
            <CardDescription>
              Showing {filteredLogs.length} of {logs.length} events
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <AuditLogEntry key={log.id} log={log} />
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No logs match your filters
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AuditLogs;