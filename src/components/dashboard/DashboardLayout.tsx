
import { useState, useEffect } from "react";
import { SidebarProvider, Sidebar } from "@/components/ui/sidebar";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const username = localStorage.getItem("postpulse-username") || "";
  const isAdmin = localStorage.getItem("postpulse-admin") === "true";

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex w-full bg-[#F5F5F5] dark:bg-gray-900">
        {/* Sidebar */}
        <Sidebar variant="sidebar" collapsible="icon">
          <DashboardSidebar />
        </Sidebar>

        {/* Main Content */}
        <div className="flex flex-col flex-1 w-full min-h-screen">
          {/* Top Navigation */}
          <DashboardHeader userRole={isAdmin ? "admin" : "user"} username={username} />

          {/* Page Content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto w-full">
            <div className="w-full mx-auto max-w-[1800px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
