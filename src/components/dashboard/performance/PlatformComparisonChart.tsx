
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, BarChartIcon } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import authService from "@/services/auth";
import { socialConnectionsApi } from "@/services/socialConnectionsApi";

interface PlatformAnalytics {
  platform: string;
  total_impressions: number;
  total_engagements: number;
  total_reach: number;
  avg_engagement_rate: number;
}

interface PlatformComparisonChartProps {
  platformData?: PlatformAnalytics[];
}

const PlatformComparisonChart = ({ platformData = [] }: PlatformComparisonChartProps) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [metric, setMetric] = useState<'engagements' | 'impressions' | 'reach'>('engagements');

  useEffect(() => {
    loadPlatformData();
  }, []);

  const loadPlatformData = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

      // Get recent posts to calculate detailed metrics
      const postsResponse = await socialConnectionsApi.getRecentPosts();
      const posts = postsResponse.posts || [];

      // Group by platform and calculate metrics
      const platformMetrics: { [key: string]: any } = {};
      
      posts.forEach((post: any) => {
        const platform = post.platform.charAt(0).toUpperCase() + post.platform.slice(1);
        if (!platformMetrics[platform]) {
          platformMetrics[platform] = {
            platform,
            likes: 0,
            shares: 0,
            comments: 0,
            engagements: 0,
            impressions: 0,
            reach: 0,
          };
        }

        if (post.analytics) {
          platformMetrics[platform].likes += post.analytics.likes || 0;
          platformMetrics[platform].shares += post.analytics.shares || 0;
          platformMetrics[platform].comments += post.analytics.comments || 0;
          platformMetrics[platform].engagements += post.analytics.engagements || 0;
          platformMetrics[platform].impressions += post.analytics.impressions || 0;
          platformMetrics[platform].reach += post.analytics.reach || 0;
        }
      });

      const formattedData = Object.values(platformMetrics);
      setChartData(formattedData);
    } catch (error) {
      console.error("Error loading platform data:", error);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

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
          <BarChartIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No platform data available yet</p>
          <p className="text-sm mt-1">Connect platforms and post content to see comparisons</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-end items-center">
        <Select value={metric} onValueChange={(value: any) => setMetric(value)}>
          <SelectTrigger className="w-[140px] h-8 text-sm">
            <SelectValue placeholder="Metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="engagements">Engagements</SelectItem>
            <SelectItem value="impressions">Impressions</SelectItem>
            <SelectItem value="reach">Reach</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-[400px] w-full">
        <ChartContainer
          config={{
            likes: { color: "#ff6b6b" },
            shares: { color: "#4ecdc4" },
            comments: { color: "#ffd166" },
            engagements: { color: "#8b5cf6" },
            impressions: { color: "#3b82f6" },
            reach: { color: "#10b981" },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="platform" />
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
              {metric === 'engagements' ? (
                <>
                  <Bar dataKey="likes" fill="var(--color-likes)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="shares" fill="var(--color-shares)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="comments" fill="var(--color-comments)" radius={[4, 4, 0, 0]} />
                </>
              ) : (
                <Bar dataKey={metric} fill={`var(--color-${metric})`} radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default PlatformComparisonChart;
