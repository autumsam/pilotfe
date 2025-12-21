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
  Activity,
  PenSquare, 
  Calendar, 
  BarChart, 
  Brain, 
  Settings,
  LogOut,
  MessageSquare,
  User,
  CreditCard,
  TrendingUp
} from "lucide-react";

const UserDashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("postpulse-authenticated");
    localStorage.removeItem("postpulse-admin");
    localStorage.removeItem("postpulse-user-role");
    localStorage.removeItem("postpulse-username");
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
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
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive("/post-activity")} 
                  tooltip="Post Activity" 
                  onClick={() => handleNavigate("/post-activity")}
                >
                  <Activity />
                  <span>Post Activity</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Performance" 
                  isActive={isActive("/performance-dashboard")}
                  onClick={() => handleNavigate("/performance-dashboard")}
                >
                  <TrendingUp />
                  <span>Performance</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Analytics" 
                  isActive={isActive("/user-analytics")}
                  onClick={() => handleNavigate("/user-analytics")}
                >
                  <BarChart />
                  <span>Analytics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Compose" 
                  isActive={isActive("/compose")}
                  onClick={() => handleNavigate("/compose")}
                >
                  <PenSquare />
                  <span>Compose Post</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Scheduled" 
                  isActive={isActive("/scheduled")}
                  onClick={() => handleNavigate("/scheduled")}
                >
                  <Calendar />
                  <span>Scheduled Posts</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Messages" 
                  isActive={isActive("/messages")}
                  onClick={() => handleNavigate("/messages")}
                >
                  <MessageSquare />
                  <span>Messages</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="AI Assistant" 
                  isActive={isActive("/ai-assistant")}
                  onClick={() => handleNavigate("/ai-assistant")}
                >
                  <Brain />
                  <span>AI Assistant</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Profile" 
                  isActive={isActive("/user-profile")}
                  onClick={() => handleNavigate("/user-profile")}
                >
                  <User />
                  <span>Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Subscription" 
                  isActive={isActive("/subscription")}
                  onClick={() => handleNavigate("/subscription")}
                >
                  <CreditCard />
                  <span>Subscription</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Settings" 
                  isActive={isActive("/user-settings")}
                  onClick={() => handleNavigate("/user-settings")}
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

export default UserDashboardSidebar;