
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BarChart as BarChartIcon } from "lucide-react";

const UserAnalytics = () => {
  // Sample data
  const monthlyData = [
    { name: "Jan", followers: 1200, engagement: 500, reach: 8000 },
    { name: "Feb", followers: 1300, engagement: 600, reach: 9000 },
    { name: "Mar", followers: 1400, engagement: 650, reach: 10000 },
    { name: "Apr", followers: 1600, engagement: 700, reach: 11000 },
    { name: "May", followers: 1750, engagement: 850, reach: 12500 },
    { name: "Jun", followers: 2000, engagement: 950, reach: 14000 },
  ];

  const platformData = [
    { name: "Twitter", followers: 2350, posts: 120, engagement: 5.2 },
    { name: "Instagram", followers: 5640, posts: 85, engagement: 7.8 },
    { name: "Facebook", followers: 3200, posts: 65, engagement: 3.6 },
    { name: "LinkedIn", followers: 1800, posts: 42, engagement: 4.5 },
  ];

  const contentTypeData = [
    { name: "Images", engagement: 65, reach: 80 },
    { name: "Videos", engagement: 85, reach: 90 },
    { name: "Text", engagement: 45, reach: 60 },
    { name: "Links", engagement: 50, reach: 65 },
  ];

  const bestPostsData = [
    {
      id: 1,
      title: "Introducing our new product feature",
      platform: "Instagram",
      engagement: 850,
      date: "May 15, 2023",
    },
    {
      id: 2,
      title: "Case study: How we increased customer conversion by 30%",
      platform: "LinkedIn",
      engagement: 650,
      date: "Jun 2, 2023",
    },
    {
      id: 3,
      title: "Behind the scenes at our team retreat",
      platform: "Instagram",
      engagement: 580,
      date: "Apr 28, 2023",
    },
  ];

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep dive into your social media performance</p>
        </div>
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card border-l-4 border-l-primary bg-gradient-to-br from-blue-50/50 to-background dark:from-blue-950/20 dark:to-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Followers</p>
                <p className="text-3xl font-bold">12,990</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <BarChartIcon className="h-6 w-6 text-primary" />
              </div>
            </div>
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">+8.4% from last month</span>
          </CardContent>
        </Card>
        
        <Card className="stat-card border-l-4 border-l-green-500 bg-gradient-to-br from-green-50/50 to-background dark:from-green-950/20 dark:to-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
                <p className="text-3xl font-bold">5.7%</p>
              </div>
              <div className="bg-green-500/10 p-3 rounded-lg">
                <BarChartIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">+1.2% from last month</span>
          </CardContent>
        </Card>
        
        <Card className="stat-card border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50/50 to-background dark:from-purple-950/20 dark:to-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                <p className="text-3xl font-bold">312</p>
              </div>
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <BarChartIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">+15 from last month</span>
          </CardContent>
        </Card>
        
        <Card className="stat-card border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50/50 to-background dark:from-amber-950/20 dark:to-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Average Reach</p>
                <p className="text-3xl font-bold">45.2k</p>
              </div>
              <div className="bg-amber-500/10 p-3 rounded-lg">
                <BarChartIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">+12% from last month</span>
          </CardContent>
        </Card>
      </div>

      <Card className="hover-lift">
        <CardHeader>
          <CardTitle>Growth Trends</CardTitle>
          <CardDescription>Six month overview of key metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ChartContainer
              config={{
                followers: { color: "#3b82f6" },
                engagement: { color: "#10b981" },
                reach: { color: "#8b5cf6" },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
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
                  <Line 
                    type="monotone" 
                    dataKey="followers" 
                    stroke="var(--color-followers)" 
                    yAxisId="left" 
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="var(--color-engagement)" 
                    yAxisId="left"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="reach" 
                    stroke="var(--color-reach)" 
                    yAxisId="right"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle>Platform Comparison</CardTitle>
            <CardDescription>Performance metrics across platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="followers" className="space-y-4">
              <TabsList>
                <TabsTrigger value="followers">Followers</TabsTrigger>
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
              </TabsList>

              <TabsContent value="followers">
                <div className="h-[250px]">
                  <ChartContainer
                    config={{
                      followers: { color: "#3b82f6" }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={platformData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="followers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </TabsContent>

              <TabsContent value="posts">
                <div className="h-[250px]">
                  <ChartContainer
                    config={{
                      posts: { color: "#10b981" }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={platformData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="posts" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </TabsContent>

              <TabsContent value="engagement">
                <div className="h-[250px]">
                  <ChartContainer
                    config={{
                      engagement: { color: "#8b5cf6" }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={platformData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="engagement" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <CardTitle>Content Type Performance</CardTitle>
            <CardDescription>Which content formats perform best</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="engagement" className="space-y-4">
              <TabsList>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="reach">Reach</TabsTrigger>
              </TabsList>

              <TabsContent value="engagement">
                <div className="h-[250px]">
                  <ChartContainer
                    config={{
                      engagement: { color: "#f59e0b" }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={contentTypeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="engagement" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </TabsContent>

              <TabsContent value="reach">
                <div className="h-[250px]">
                  <ChartContainer
                    config={{
                      reach: { color: "#ec4899" }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={contentTypeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="reach" fill="#ec4899" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card className="hover-lift">
        <CardHeader>
          <CardTitle>Top Performing Posts</CardTitle>
          <CardDescription>Your best content this quarter</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Post</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Platform</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Engagement</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {bestPostsData.map((post) => (
                  <tr key={post.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">{post.title}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{post.platform}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{post.engagement}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{post.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAnalytics;
