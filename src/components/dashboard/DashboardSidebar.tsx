
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
  PenSquare, 
  Calendar, 
  BarChart, 
  Brain, 
  Settings,
  LogOut,
  ShieldCheck,
  Users,
  Activity,
  Globe
} from "lucide-react";

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    localStorage.removeItem("postpulse-authenticated");
    localStorage.removeItem("postpulse-admin");
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // Check if user is admin (in a real app, this would use auth context)
  const isAdmin = localStorage.getItem("postpulse-admin") === "true";
  
  // Check if current route is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <SidebarHeader>
        <a href="/" className="flex items-center gap-2 p-4 hover:opacity-70 transition-opacity">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-postpulse-blue to-blue-400 flex items-center justify-center text-white font-bold">
            P
          </div>
          <h1 className="text-xl font-bold text-postpulse-blue truncate">
            Post<span className="font-normal text-postpulse-darkBlue">Pulse</span>
          </h1>
        </a>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive("/dashboard")} 
                  tooltip="Dashboard" 
                  onClick={() => handleNavigate("/dashboard")}
                >
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Analytics" 
                  isActive={isActive("/analytics")}
                  onClick={() => handleNavigate("/dashboard")}
                >
                  <BarChart />
                  <span>Analytics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Compose" 
                  isActive={false}
                  onClick={() => handleNavigate("/dashboard")}
                >
                  <PenSquare />
                  <span>Compose Post</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Scheduled" 
                  isActive={false}
                  onClick={() => handleNavigate("/dashboard")}
                >
                  <Calendar />
                  <span>Scheduled Posts</span>
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
                <SidebarMenuButton tooltip="Social Media" onClick={() => handleNavigate("/api-stats/social")}>
                  <Globe />
                  <span>Social Media APIs</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="AI Usage" onClick={() => handleNavigate("/api-stats/ai")}>
                  <Brain />
                  <span>AI API Usage</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Performance" onClick={() => handleNavigate("/api-stats/performance")}>
                  <Activity />
                  <span>API Performance</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Analytics" 
                    isActive={isActive("/admin") && location.search.includes("analytics")}
                    onClick={() => navigate("/admin?tab=analytics")}
                  >
                    <BarChart />
                    <span>Analytics Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="User Management" 
                    isActive={isActive("/admin") && !location.search.includes("analytics") && !location.search.includes("settings")}
                    onClick={() => navigate("/admin")}
                  >
                    <Users />
                    <span>User Management</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Admin Settings"
                    isActive={isActive("/admin") && location.search.includes("settings")} 
                    onClick={() => navigate("/admin?tab=settings")}
                  >
                    <ShieldCheck />
                    <span>System Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="AI Assistant" 
                  isActive={false}
                  onClick={() => handleNavigate("/dashboard")}
                >
                  <Brain />
                  <span>AI Assistant</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Settings" 
                  isActive={isActive("/settings")}
                  onClick={() => handleNavigate("/settings")}
                >
                  <Settings />
                  <span>Settings</span>
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
            className="w-full justify-start text-red-500 gap-2"
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

export default DashboardSidebar;
