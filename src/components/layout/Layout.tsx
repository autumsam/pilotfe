
import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const path = location.pathname;
  
  // Check if the current path is a dashboard or protected path
  const isProtectedPath = 
    path.startsWith("/dashboard") || 
    path === "/settings" || 
    path.startsWith("/admin") ||
    path.startsWith("/api-stats") ||
    path.startsWith("/user-management") ||
    path.startsWith("/system-settings") ||
    path.startsWith("/user-analytics") ||
    path.startsWith("/user-profile") ||
    path.startsWith("/post-activity") ||
    path.startsWith("/performance-dashboard") ||
    path.startsWith("/schedule-posts") ||
    path === "/subscription" ||
    path === "/compose" ||
    path === "/scheduled" ||
    path === "/messages" ||
    path === "/ai-assistant";
  
  return (
    <div className={`min-h-screen transition-colors duration-300 w-full ${isProtectedPath ? 'dark:bg-gray-900' : 'bg-white'}`}>
      {isProtectedPath ? (
        // For protected pages, don't add the public navbar - the DashboardLayout components will handle their own navigation
        <div className="w-full">{children}</div>
      ) : (
        // For public pages, force light mode and add the navbar and footer
        <div className="flex flex-col min-h-screen w-full light">
          <Navbar />
          <main className="flex-grow w-full overflow-x-hidden">{children}</main>
          <Footer />
        </div>
      )}
    </div>
  );
}
