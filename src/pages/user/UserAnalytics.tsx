
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Users, TrendingUp, FileText, Eye } from "lucide-react";
import AnimatedPage from "@/components/animations/AnimatedPage";
import AnimatedCard from "@/components/animations/AnimatedCard";
import AnimatedNumber from "@/components/animations/AnimatedNumber";
import { motion, useReducedMotion } from "framer-motion";

const UserAnalytics = () => {
  const shouldReduceMotion = useReducedMotion();
  
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
    <AnimatedPage>
      <div className="space-y-4 md:space-y-6 w-full pb-20 md:pb-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 0.1 
        }}
      >
        <h1 className="text-xl md:text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Your social media performance</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <AnimatedCard delay={0}>
          <motion.div
            whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="space-y-1">
                  <p className="text-xs md:text-sm text-muted-foreground">Total Followers</p>
                  <p className="text-2xl md:text-3xl font-bold">
                    <AnimatedNumber value={12990} />
                  </p>
                </div>
                <motion.div 
                  className="bg-primary/10 p-3 rounded-lg"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </motion.div>
              </div>
              <motion.span 
                className="text-xs text-green-600 dark:text-green-400 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                +8.4% from last month
              </motion.span>
            </CardContent>
          </Card>
          </motion.div>
        </AnimatedCard>
        
        <AnimatedCard delay={0.05}>
          <motion.div
            whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="space-y-1">
                  <p className="text-xs md:text-sm text-muted-foreground">Engagement Rate</p>
                  <p className="text-2xl md:text-3xl font-bold">
                    <AnimatedNumber value={5.7} format={(n) => n.toFixed(1) + '%'} />
                  </p>
                </div>
                <motion.div 
                  className="bg-green-500/10 p-3 rounded-lg"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-green-600 dark:text-green-400" />
                </motion.div>
              </div>
              <motion.span 
                className="text-xs text-green-600 dark:text-green-400 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                +1.2% from last month
              </motion.span>
            </CardContent>
          </Card>
          </motion.div>
        </AnimatedCard>
        
        <AnimatedCard delay={0.1}>
          <motion.div
            whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="space-y-1">
                  <p className="text-xs md:text-sm text-muted-foreground">Total Posts</p>
                  <p className="text-2xl md:text-3xl font-bold">
                    <AnimatedNumber value={312} />
                  </p>
                </div>
                <motion.div 
                  className="bg-purple-500/10 p-3 rounded-lg"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <FileText className="h-5 w-5 md:h-6 md:w-6 text-purple-600 dark:text-purple-400" />
                </motion.div>
              </div>
              <motion.span 
                className="text-xs text-green-600 dark:text-green-400 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                +15 from last month
              </motion.span>
            </CardContent>
          </Card>
          </motion.div>
        </AnimatedCard>
        
        <AnimatedCard delay={0.15}>
          <motion.div
            whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="space-y-1">
                  <p className="text-xs md:text-sm text-muted-foreground">Average Reach</p>
                  <p className="text-2xl md:text-3xl font-bold">
                    <AnimatedNumber value={45200} format={(n) => (n/1000).toFixed(1) + 'k'} />
                  </p>
                </div>
                <motion.div 
                  className="bg-amber-500/10 p-3 rounded-lg"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Eye className="h-5 w-5 md:h-6 md:w-6 text-amber-600 dark:text-amber-400" />
                </motion.div>
              </div>
              <motion.span 
                className="text-xs text-green-600 dark:text-green-400 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                +12% from last month
              </motion.span>
            </CardContent>
          </Card>
          </motion.div>
        </AnimatedCard>
      </div>

      <AnimatedCard delay={0.2}>
        <Card className="border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base md:text-lg font-semibold">Growth Trends</CardTitle>
          <CardDescription className="text-xs md:text-sm">Six month overview</CardDescription>
        </CardHeader>
        <CardContent className="px-2 md:px-6">
          <div className="h-[250px] md:h-[300px] w-full">
            <ChartContainer
              config={{
                followers: { color: "hsl(var(--primary))" },
                engagement: { color: "hsl(var(--chart-2))" },
                reach: { color: "hsl(var(--chart-3))" },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis yAxisId="left" className="text-xs" />
                  <YAxis yAxisId="right" orientation="right" className="text-xs" />
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
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="followers" 
                    stroke="var(--color-followers)" 
                    yAxisId="left" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="var(--color-engagement)" 
                    yAxisId="left"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="reach" 
                    stroke="var(--color-reach)" 
                    yAxisId="right"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      </AnimatedCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <AnimatedCard delay={0.25}>
          <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg font-semibold">Platform Comparison</CardTitle>
            <CardDescription className="text-xs md:text-sm">Performance by platform</CardDescription>
          </CardHeader>
          <CardContent className="px-2 md:px-6">
            <Tabs defaultValue="followers" className="space-y-3">
              <TabsList className="grid w-full grid-cols-3 h-8 md:h-9">
                <TabsTrigger value="followers" className="text-xs md:text-sm">Followers</TabsTrigger>
                <TabsTrigger value="posts" className="text-xs md:text-sm">Posts</TabsTrigger>
                <TabsTrigger value="engagement" className="text-xs md:text-sm">Engagement</TabsTrigger>
              </TabsList>

              <TabsContent value="followers">
                <div className="h-[200px] md:h-[220px]">
                  <ChartContainer
                    config={{
                      followers: { color: "hsl(var(--primary))" }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={platformData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip />
                        <Bar dataKey="followers" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </TabsContent>

              <TabsContent value="posts">
                <div className="h-[200px] md:h-[220px]">
                  <ChartContainer
                    config={{
                      posts: { color: "hsl(var(--chart-2))" }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={platformData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip />
                        <Bar dataKey="posts" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </TabsContent>

              <TabsContent value="engagement">
                <div className="h-[200px] md:h-[220px]">
                  <ChartContainer
                    config={{
                      engagement: { color: "hsl(var(--chart-3))" }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={platformData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip />
                        <Bar dataKey="engagement" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.3}>
          <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg font-semibold">Content Performance</CardTitle>
            <CardDescription className="text-xs md:text-sm">Best content formats</CardDescription>
          </CardHeader>
          <CardContent className="px-2 md:px-6">
            <Tabs defaultValue="engagement" className="space-y-3">
              <TabsList className="grid w-full grid-cols-2 h-8 md:h-9">
                <TabsTrigger value="engagement" className="text-xs md:text-sm">Engagement</TabsTrigger>
                <TabsTrigger value="reach" className="text-xs md:text-sm">Reach</TabsTrigger>
              </TabsList>

              <TabsContent value="engagement">
                <div className="h-[200px] md:h-[220px]">
                  <ChartContainer
                    config={{
                      engagement: { color: "hsl(var(--primary))" }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={contentTypeData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip />
                        <Bar dataKey="engagement" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </TabsContent>

              <TabsContent value="reach">
                <div className="h-[200px] md:h-[220px]">
                  <ChartContainer
                    config={{
                      reach: { color: "hsl(var(--chart-2))" }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={contentTypeData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip />
                        <Bar dataKey="reach" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        </AnimatedCard>
      </div>

      <AnimatedCard delay={0.35}>
        <Card className="border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base md:text-lg font-semibold">Top Performing Posts</CardTitle>
          <CardDescription className="text-xs md:text-sm">Your best content this quarter</CardDescription>
        </CardHeader>
        <CardContent className="p-0 md:p-6 md:pt-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-muted-foreground">Post</th>
                  <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-muted-foreground">Platform</th>
                  <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-muted-foreground">Engagement</th>
                  <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-muted-foreground hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {bestPostsData.map((post) => (
                  <tr key={post.id} className="border-b last:border-0">
                    <td className="px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm">{post.title}</td>
                    <td className="px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm">{post.platform}</td>
                    <td className="px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm font-medium">{post.engagement}</td>
                    <td className="px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm text-muted-foreground hidden md:table-cell">{post.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      </AnimatedCard>
    </div>
    </AnimatedPage>
  );
};

export default UserAnalytics;
