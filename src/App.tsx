import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "@/components/ui/toaster";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ApiStats from "./pages/ApiStats";
import { Toaster as SonnerToaster } from "sonner";
import UserLayout from "./components/dashboard/UserLayout";
import AdminLayout from "./components/dashboard/AdminLayout";
import { AnimatePresence } from "framer-motion";

// User Pages
import PostActivity from "./pages/user/PostActivity";
import PerformanceDashboard from "./pages/user/PerformanceDashboard";
import SchedulePosts from "./pages/user/SchedulePosts";
import UserAnalytics from "./pages/user/UserAnalytics";
import Settings from "./pages/user/Settings";
import Socials from "./pages/user/Socials";
import Messages from "./pages/user/Messages";
import Compose from "./pages/user/Compose";
import Scheduled from "./pages/user/Scheduled";
import AiAssistant from "./pages/user/AiAssistant";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import SystemSettings from "./pages/admin/SystemSettings";
import AuditLogs from "./pages/admin/AuditLogs";
import Alerts from "./pages/admin/Alerts";
import AdminSettings from "./pages/admin/AdminSettings";

// Public Pages
import About from "./pages/About";
import Contact from "./pages/Contact";
import Subscription from "./pages/Subscription";

// OAuth Callback
import OAuthCallback from "./pages/OAuthCallback";

// Auth guard component for any authenticated user
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("postpulse-authenticated") === "true";
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin guard component - only for admin users
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("postpulse-authenticated") === "true";
  const isAdmin = localStorage.getItem("postpulse-admin") === "true";
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/post-activity" replace />;
  }
  
  return <>{children}</>;
};

// User guard component - only for regular users
const UserRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("postpulse-authenticated") === "true";
  const isAdmin = localStorage.getItem("postpulse-admin") === "true";
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (isAdmin) {
    return <Navigate to="/admin-dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Redirect authenticated users to appropriate dashboard
const RedirectToDashboard = () => {
  const isAuthenticated = localStorage.getItem("postpulse-authenticated") === "true";
  const isAdmin = localStorage.getItem("postpulse-admin") === "true";
  
  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin-dashboard" : "/home"} replace />;
  }
  
  return <Navigate to="/login" replace />;
};

// Animated Routes wrapper
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
          {/* Public Pages */}
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          
          {/* OAuth Callback Route */}
          <Route path="/auth/callback/:platform" element={
            <ProtectedRoute><OAuthCallback /></ProtectedRoute>
          } />
          
          {/* Regular User Routes */}
          <Route path="/home" element={
            <UserRoute><UserLayout><PostActivity /></UserLayout></UserRoute>
          } />
          {/* Legacy route - redirect to new home route */}
          <Route path="/post-activity" element={<Navigate to="/home" replace />} />
          <Route path="/performance-dashboard" element={
            <UserRoute><UserLayout><PerformanceDashboard /></UserLayout></UserRoute>
          } />
          <Route path="/schedule-posts" element={
            <UserRoute><UserLayout><SchedulePosts /></UserLayout></UserRoute>
          } />
          <Route path="/user-analytics" element={
            <UserRoute><UserLayout><UserAnalytics /></UserLayout></UserRoute>
          } />
          <Route path="/user-settings" element={
            <UserRoute><UserLayout><Settings /></UserLayout></UserRoute>
          } />
          {/* Legacy routes - redirect to new settings page */}
          <Route path="/user-profile" element={<Navigate to="/user-settings" replace />} />
          <Route path="/socials" element={
            <UserRoute><UserLayout><Socials /></UserLayout></UserRoute>
          } />
          <Route path="/messages" element={
            <UserRoute><UserLayout><Messages /></UserLayout></UserRoute>
          } />
          <Route path="/compose" element={
            <UserRoute><UserLayout><Compose /></UserLayout></UserRoute>
          } />
          <Route path="/scheduled" element={
            <UserRoute><UserLayout><Scheduled /></UserLayout></UserRoute>
          } />
          <Route path="/ai-assistant" element={
            <UserRoute><UserLayout><AiAssistant /></UserLayout></UserRoute>
          } />
          <Route path="/subscription" element={
            <UserRoute><UserLayout><Subscription /></UserLayout></UserRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={
            <AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>
          } />
          <Route path="/user-management" element={
            <AdminRoute><AdminLayout><UserManagement /></AdminLayout></AdminRoute>
          } />
          <Route path="/system-settings" element={
            <AdminRoute><AdminLayout><SystemSettings /></AdminLayout></AdminRoute>
          } />
          <Route path="/admin-settings" element={
            <AdminRoute><AdminLayout><AdminSettings /></AdminLayout></AdminRoute>
          } />
          <Route path="/api-stats/:category" element={
            <AdminRoute><AdminLayout><ApiStats /></AdminLayout></AdminRoute>
          } />
          <Route path="/audit-logs" element={
            <AdminRoute><AuditLogs /></AdminRoute>
          } />
          <Route path="/alerts" element={
            <AdminRoute><Alerts /></AdminRoute>
          } />
          
          {/* Legacy routes - redirect to new routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              {localStorage.getItem("postpulse-admin") === "true" ? 
                <Navigate to="/admin-dashboard" replace /> : 
                <Navigate to="/home" replace />
              }
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <AdminRoute><Navigate to="/admin-dashboard" replace /></AdminRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              {localStorage.getItem("postpulse-admin") === "true" ? 
                <Navigate to="/admin-settings" replace /> : 
                <Navigate to="/user-settings" replace />
              }
            </ProtectedRoute>
          } />
          
          {/* Not Found */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AnimatedRoutes />
        <Toaster />
        <SonnerToaster position="top-center" closeButton />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;