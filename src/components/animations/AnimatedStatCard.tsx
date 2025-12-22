import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface AnimatedStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  borderColor: string;
  iconBgColor: string;
  iconColor: string;
  growth?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
}

const AnimatedStatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  borderColor, 
  iconBgColor,
  iconColor,
  growth,
  delay = 0 
}: AnimatedStatCardProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ 
        opacity: shouldReduceMotion ? 1 : 0, 
        y: shouldReduceMotion ? 0 : 20 
      }}
      animate={{ 
        opacity: 1, 
        y: 0 
      }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.4,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={shouldReduceMotion ? {} : {
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
    >
      <Card className={`${borderColor} shadow-sm hover:shadow-md transition-shadow`}>
        <CardContent className="p-3 md:p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground truncate">{title}</p>
              <motion.div 
                className={`${iconBgColor} p-2 rounded-lg shrink-0`}
                whileHover={shouldReduceMotion ? {} : {
                  scale: 1.1,
                  rotate: 5,
                  transition: { duration: 0.2 }
                }}
              >
                <Icon className={`h-4 w-4 md:h-5 md:w-5 ${iconColor}`} />
              </motion.div>
            </div>
            <div className="space-y-1">
              <motion.p 
                className="text-2xl md:text-3xl font-bold"
                initial={{ scale: shouldReduceMotion ? 1 : 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: shouldReduceMotion ? 0 : delay + 0.1,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                {value}
              </motion.p>
              {growth && (
                <motion.div 
                  className={`flex items-center gap-1 text-xs ${growth.isPositive ? 'text-green-600' : 'text-red-600'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: shouldReduceMotion ? 0 : delay + 0.2 }}
                >
                  <motion.span
                    animate={shouldReduceMotion ? {} : {
                      y: growth.isPositive ? [-2, 0] : [2, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                  >
                    {growth.isPositive ? '↑' : '↓'}
                  </motion.span>
                  <span>{Math.abs(growth.value).toFixed(1)}%</span>
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AnimatedStatCard;
