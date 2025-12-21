
import { useState, useEffect } from "react";
import { SidebarProvider, Sidebar } from "@/components/ui/sidebar";
import DashboardHeader from "./DashboardHeader";
import UserSidebar from "./UserSidebar";
import CreatePostModal from "../modals/CreatePostModal";

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const username = localStorage.getItem("postpulse-username") || "";

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
          <UserSidebar />
        </Sidebar>

        {/* Main Content */}
        <div className="flex flex-col flex-1 w-full min-h-screen">
          {/* Top Navigation */}
          <DashboardHeader 
            userRole="user" 
            username={username}
          />

          {/* Page Content */}
          <main className="flex-1 p-2 sm:p-3 md:p-4 lg:p-6 overflow-auto w-full">
            <div className="w-full mx-auto max-w-[1400px]">
              {children}
            </div>
          </main>

          {/* Fixed Create Post Button on all user pages */}
          <div className="fixed bottom-6 right-6">
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="bg-postpulse-orange hover:bg-orange-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
              aria-label="Create new post"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M12 5v14M5 12h14"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Create Post Modal */}
        <CreatePostModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
        />
      </div>
    </SidebarProvider>
  );
};

export default UserLayout;
