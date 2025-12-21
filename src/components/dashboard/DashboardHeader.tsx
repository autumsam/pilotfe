
import { Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DashboardHeaderProps {
  userRole: "admin" | "user";
  username?: string;
}

const DashboardHeader = ({ userRole, username = "" }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className={`backdrop-blur bg-gradient-to-r ${userRole === 'admin' ? 'from-purple-700 to-purple-600' : 'from-postpulse-blue to-blue-600'} dark:bg-gray-800 text-white h-16 sticky top-0 z-30 flex items-center px-4 w-full shadow-none border-b border-slate-100/30`}>
      <div className="flex items-center gap-2 md:gap-4 w-full">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="text-white hover:bg-opacity-20 hover:bg-white" />
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold tracking-tight">
              {userRole === "admin" ? "Admin Dashboard" : "User Dashboard"}
            </h1>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-auto">
          <div className="relative">
            <Input
              placeholder="Search..."
              className={`pl-8 ${userRole === 'admin' ? 'bg-purple-600' : 'bg-blue-600'} dark:bg-gray-700 ${userRole === 'admin' ? 'border-purple-500' : 'border-blue-500'} dark:border-gray-600 text-white placeholder:text-gray-300 h-9 focus-visible:ring-offset-blue-600 rounded-full transition-all`}
              style={{ paddingLeft: "2.25rem" }}
            />
            <span className="absolute left-2 top-2.5">
              <svg className="h-4 w-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx={11} cy={11} r={8}></circle>
                <line x1={21} y1={21} x2={16.65} y2={16.65}></line>
              </svg>
            </span>
          </div>
        </div>

        {/* Right icons and actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button size="icon" variant="ghost" className="relative text-white hover:bg-white/10">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
          </Button>

          {/* Profile dropdown */}
          <div className="flex items-center gap-2 ml-2">
            <Avatar className="bg-gradient-to-br from-purple-400 to-blue-400 dark:bg-gray-600 border-2 border-white/20">
              <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="hidden lg:block text-sm">
              <div className="font-semibold">{username}</div>
              <div className="text-xs text-gray-200 capitalize">{userRole}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
