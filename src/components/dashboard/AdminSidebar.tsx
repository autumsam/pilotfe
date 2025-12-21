import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Settings,
  LogOut,
  Users,
  Activity,
  Globe,
  Brain,
  ShieldCheck,
  FileText,
  Bell
} from "lucide-react";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("postpulse-authenticated");
    localStorage.removeItem("postpulse-admin");
    localStorage.removeItem("postpulse-username");
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <>
      <SidebarHeader>
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 p-4 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-sm">
            P
          </div>
          <h1 className="text-xl font-bold">
            <span className="text-primary">Post</span>
            <span className="text-foreground">Pulse</span>
          </h1>
        </button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive("/admin-dashboard")} 
                  tooltip="Dashboard" 
                  onClick={() => handleNavigate("/admin-dashboard")}
                >
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive("/user-management")} 
                  tooltip="User Management" 
                  onClick={() => handleNavigate("/user-management")}
                >
                  <Users />
                  <span>User Management</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive("/system-settings")} 
                  tooltip="System Settings" 
                  onClick={() => handleNavigate("/system-settings")}
                >
                  <ShieldCheck />
                  <span>System Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive("/audit-logs")} 
                  tooltip="Audit Logs" 
                  onClick={() => handleNavigate("/audit-logs")}
                >
                  <FileText />
                  <span>Audit Logs</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive("/alerts")} 
                  tooltip="Real-time Alerts" 
                  onClick={() => handleNavigate("/alerts")}
                >
                  <Bell />
                  <span>Alerts</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>API Stats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive("/api-stats/social")} 
                  tooltip="Social Media APIs" 
                  onClick={() => handleNavigate("/api-stats/social")}
                >
                  <Globe />
                  <span>Social Media APIs</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive("/api-stats/ai")} 
                  tooltip="AI API Usage" 
                  onClick={() => handleNavigate("/api-stats/ai")}
                >
                  <Brain />
                  <span>AI API Usage</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive("/api-stats/performance")} 
                  tooltip="API Performance" 
                  onClick={() => handleNavigate("/api-stats/performance")}
                >
                  <Activity />
                  <span>API Performance</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive("/admin-settings")} 
                  tooltip="Account Settings" 
                  onClick={() => handleNavigate("/admin-settings")}
                >
                  <Settings />
                  <span>Account Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </>
  );
};

export default AdminSidebar;