
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BarChart, Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import authService from "@/services/auth";

interface PlatformAnalytics {
  platform: string;
  total_impressions: number;
  total_engagements: number;
  total_reach: number;
  avg_engagement_rate: number;
}

interface DailyData {
  date: string;
  platform: string;
  total_engagements: number;
}

interface EngagementLineChartProps {
  platformData?: PlatformAnalytics[];
}

const EngagementLineChart = ({ platformData = [] }: EngagementLineChartProps) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    loadDailyAnalytics();
  }, []);

  const loadDailyAnalytics = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

      const response = await fetch(`${API_BASE_URL}/api/analytics/daily/?ordering=-date&limit=7`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const results = data.results || data;
        
        // Group by date
        const groupedByDate: { [key: string]: any } = {};
        results.forEach((item: any) => {
          const date = new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' });
          if (!groupedByDate[date]) {
            groupedByDate[date] = { day: date };
          }
          const platformName = item.platform.charAt(0).toUpperCase() + item.platform.slice(1);
          groupedByDate[date][platformName] = item.total_engagements;
        });

        const formattedData = Object.values(groupedByDate).reverse();
        setChartData(formattedData);
      }
    } catch (error) {
      console.error("Error loading daily analytics:", error);
      // Set empty data on error
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique platforms from the data
  const platforms = Array.from(new Set(
    chartData.flatMap(item => Object.keys(item).filter(key => key !== 'day'))
  ));

  if (loading) {
    return (
      <div className="h-72 w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="h-72 w-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <BarChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No engagement data available yet</p>
          <p className="text-sm mt-1">Post content to see engagement trends</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
    <div className="h-8 flex items-center">
      {/* Empty spacer to match PlatformComparisonChart dropdown height */}
    </div>
    <div className="h-[400px] w-full">
      <ChartContainer
        config={{
          twitter: { color: "#1DA1F2" },
          instagram: { color: "#E1306C" },
          facebook: { color: "#4267B2" },
          linkedin: { color: "#0077B5" },
          tiktok: { color: "#000000" },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" />
            <YAxis />
            <ChartTooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <ChartTooltipContent active={active} payload={payload} label={label} />
                  );
                }
                return null;
              }}
            />
            <Legend />
            {platforms.map((platform) => (
              <Line 
                key={platform}
                type="monotone" 
                dataKey={platform} 
                stroke={`var(--color-${platform.toLowerCase()})`} 
                strokeWidth={2} 
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
    </div>
  );
};

export default EngagementLineChart;
