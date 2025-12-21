
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface AiApi {
  name: string;
  calls: number;
  quota: number;
  color: string;
}

interface AiApiSectionProps {
  aiApiData: any[];
  aiApiUsage: AiApi[];
}

const AiApiSection = ({ aiApiData, aiApiUsage }: AiApiSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {aiApiUsage.map((api) => (
          <Card key={api.name} className="overflow-hidden border-t-4" style={{ borderTopColor: api.color }}>
            <CardHeader className="pb-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain size={18} color={api.color} />
                {api.name}
              </CardTitle>
              <CardDescription>API calls this month</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{api.calls}</div>
                <div className="text-sm text-muted-foreground">
                  {Math.round((api.calls / api.quota) * 100)}% of quota
                </div>
              </div>
              <div className="mt-3 h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (api.calls / api.quota) * 100)}%`,
                    backgroundColor: api.color
                  }}
                />
              </div>
              <div className="mt-1 text-xs text-right text-muted-foreground">
                Limit: {api.quota}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="shadow-sm border dark:border-gray-700">
        <CardHeader className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <CardTitle className="text-xl font-semibold">AI API Usage Trends</CardTitle>
          <CardDescription>API calls over the last 7 months</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aiApiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
                <Legend />
                <Bar dataKey="content" name="Content Generation" fill="#5D5FEF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="image" name="Image Analysis" fill="#3ABFF8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="analysis" name="Text Analysis" fill="#36D399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AiApiSection;
