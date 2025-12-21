import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsGrid from "./performance/StatsGrid";
import EngagementLineChart from "./performance/EngagementLineChart";
import PlatformComparisonChart from "./performance/PlatformComparisonChart";
import AiInsights from "./performance/AiInsights";
import RecentPosts from "./performance/RecentPosts";
import { ChartLine } from "lucide-react";

const UserPerformanceDashboard = () => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-0">
        <div>
          <h2 className="text-2xl font-bold">Performance Dashboard</h2>
          <p className="text-sm text-muted-foreground">Track your social media performance</p>
        </div>
        <ChartLine className="w-6 h-6 text-muted-foreground" />
      </div>

      {/* Tabs - Visible on ALL screens */}
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="px-4 md:px-0">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
            <TabsTrigger value="overview" className="text-xs md:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="posts" className="text-xs md:text-sm">
              Posts
            </TabsTrigger>
            <TabsTrigger value="engagement" className="text-xs md:text-sm">
              Engagement
            </TabsTrigger>
            <TabsTrigger value="platforms" className="text-xs md:text-sm">
              Platforms
            </TabsTrigger>
            <TabsTrigger value="insights" className="text-xs md:text-sm">
              AI Insights
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <StatsGrid />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Weekly Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <EngagementLineChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Platform Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <PlatformComparisonChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recent Posts Tab */}
        <TabsContent value="posts" className="space-y-4">
          <RecentPosts />
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Detailed Engagement Metrics</CardTitle>
              <CardDescription>Track how your audience engages with your content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] md:h-[400px] w-full">
                <EngagementLineChart />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platforms Tab */}
        <TabsContent value="platforms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Platform Performance</CardTitle>
              <CardDescription>Compare performance across your connected platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] md:h-[400px] w-full">
                <PlatformComparisonChart />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">AI Generated Insights</CardTitle>
              <CardDescription>Data-driven recommendations to improve your content</CardDescription>
            </CardHeader>
            <CardContent>
              <AiInsights />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserPerformanceDashboard;