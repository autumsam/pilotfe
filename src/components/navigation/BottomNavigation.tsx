import { motion } from "framer-motion";
import { Home, Users, BarChart3, Activity, UserCog } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface NavItem {
  id: string;
  label: string;
  icon: typeof Home;
  path: string;
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: Home, path: "/home" },
  { id: "social", label: "Social", icon: Users, path: "/socials" },
  { id: "analytics", label: "Analytics", icon: BarChart3, path: "/user-analytics" },
  { id: "performance", label: "Performance", icon: Activity, path: "/performance-dashboard" },
  { id: "settings", label: "Settings", icon: UserCog, path: "/user-settings" },
];

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border z-50 shadow-lg"
    >
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center justify-center gap-1 transition-colors group"
            >
              {/* Active indicator */}
              {active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon with scale animation on active */}
              <motion.div
                animate={{
                  scale: active ? 1.1 : 1,
                  y: active ? -2 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  }`}
                />
              </motion.div>

              {/* Label */}
              <span
                className={`text-xs font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {item.label}
              </span>

              {/* Ripple effect on tap */}
              <motion.div
                className="absolute inset-0 rounded-lg"
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
              />
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default BottomNavigation;
