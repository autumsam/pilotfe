
import { TrendingUp, TrendingDown } from "lucide-react";
import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  subtitle?: string;
  action?: React.ReactNode;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, change, subtitle, action, icon }: StatCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border p-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</div>
          <div className="text-2xl font-bold dark:text-white">{value}</div>
          
          {change !== undefined && (
            <div className={`flex items-center text-xs mt-1 ${change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {change >= 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{change}% this week
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 mr-1" />
                  {change}% this week
                </>
              )}
            </div>
          )}
          
          {subtitle && <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</div>}
          {action && <div className="mt-2">{action}</div>}
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full text-postpulse-blue dark:text-blue-400">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
