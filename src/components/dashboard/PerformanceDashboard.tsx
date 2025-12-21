
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp, LineChart } from "lucide-react";
import StatsGrid from "./performance/StatsGrid";
import ChartSection from "./performance/ChartSection";
import PlatformComparisonChart from "./performance/PlatformComparisonChart";

const PerformanceDashboard = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <Card className="border shadow-md overflow-hidden">
      <div 
        className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 border-b p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <LineChart className="h-5 w-5 text-postpulse-blue dark:text-blue-400" />
          <h2 className="font-semibold text-lg dark:text-white">Performance Dashboard</h2>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="7d" onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px] h-8 text-sm">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 max-h-[700px] overflow-y-auto">
          {/* Quick Stats */}
          <StatsGrid />

          {/* Charts */}
          <ChartSection />

          {/* Platform Comparison Chart */}
          <PlatformComparisonChart />
        </div>
      )}
    </Card>
  );
};

export default PerformanceDashboard;
