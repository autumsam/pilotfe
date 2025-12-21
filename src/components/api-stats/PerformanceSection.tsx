
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery, LineChart as LineChartIcon, PieChart } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface PerformanceSectionProps {
  performanceData: any[];
}

const PerformanceSection = ({ performanceData }: PerformanceSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardTitle className="text-base flex items-center gap-2">
              <Battery className="h-5 w-5 text-green-600" />
              Uptime
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold">99.8%</div>
            <p className="text-sm text-muted-foreground mt-2">Last 30 days</p>
            <div className="mt-3 h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '99.8%' }} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardTitle className="text-base flex items-center gap-2">
              <LineChartIcon className="h-5 w-5 text-blue-600" />
              Avg. Latency
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold">98ms</div>
            <p className="text-sm text-muted-foreground mt-2">Last 30 days</p>
            <div className="mt-3 h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '70%' }} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardTitle className="text-base flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              Error Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold">0.2%</div>
            <p className="text-sm text-muted-foreground mt-2">Last 30 days</p>
            <div className="mt-3 h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: '0.2%' }} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-sm border dark:border-gray-700">
        <CardHeader className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <CardTitle className="text-xl font-semibold">API Performance Trends</CardTitle>
          <CardDescription>Performance metrics over the last 7 months</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="latency" name="Latency (ms)" stroke="#2563EB" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="success" name="Success Rate (%)" stroke="#10B981" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="errors" name="Error Rate (%)" stroke="#EF4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceSection;
