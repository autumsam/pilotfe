
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
  BarChart, 
  Calendar, 
  Settings,
  LogOut,
  User,
  PenSquare
} from "lucide-react";

const UserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("postpulse-username") || "User";
  
  const handleLogout = () => {
    localStorage.removeItem("postpulse-authenticated");
    localStorage.removeItem("postpulse-admin");
    localStorage.removeItem("postpulse-username");
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  // Check if current route is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-4">
          <div className="w-7 h-7 rounded-full bg-postpulse-blue flex items-center justify-center text-white font-bold">
            P
          </div>
          <h1 className="text-xl font-bold text-postpulse-blue truncate">
            Post<span className="font-normal text-postpulse-darkBlue">Pulse</span>
          </h1>
        </div>
        <div className="px-4 py-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <div className="text-sm font-medium">{username}</div>
              <div className="text-xs text-muted-foreground">User</div>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive("/post-activity")} 
                  tooltip="Post Activity" 
                  onClick={() => handleNavigate("/post-activity")}
                >
                  <LayoutDashboard />
                  <span>Post Activity</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive("/performance-dashboard")} 
                  tooltip="Performance Dashboard" 
                  onClick={() => handleNavigate("/performance-dashboard")}
                >
                  <BarChart />
                  <span>Performance</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive("/user-analytics")} 
                  tooltip="Analytics" 
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
                  isActive={isActive("/schedule-posts")} 
                  tooltip="Schedule Posts" 
                  onClick={() => handleNavigate("/schedule-posts")}
                >
                  <Calendar />
                  <span>Schedule Posts</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Create Post" 
                  onClick={() => {
                    // This opens the modal, but would be handled by the parent component
                    document.dispatchEvent(new CustomEvent('openPostModal'));
                  }}
                >
                  <PenSquare />
                  <span>Create Post</span>
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
                  isActive={isActive("/user-profile")} 
                  tooltip="Profile" 
                  onClick={() => handleNavigate("/user-profile")}
                >
                  <User />
                  <span>Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive("/settings")} 
                  tooltip="Settings" 
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

export default UserSidebar;
