
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface SocialPlatform {
  name: string;
  calls: number;
  quota: number;
  color: string;
}

interface SocialMediaSectionProps {
  socialApiData: any[];
  socialPlatformUsage: SocialPlatform[];
}

const SocialMediaSection = ({ socialApiData, socialPlatformUsage }: SocialMediaSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {socialPlatformUsage.map((platform) => (
          <Card key={platform.name} className="overflow-hidden border-t-4" style={{ borderTopColor: platform.color }}>
            <CardHeader className="pb-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardTitle className="text-base flex items-center gap-2">
                {platform.name === "Facebook" && <Facebook size={18} color={platform.color} />}
                {platform.name === "Twitter" && <Twitter size={18} color={platform.color} />}
                {platform.name === "Instagram" && <Instagram size={18} color={platform.color} />}
                {platform.name === "YouTube" && <Youtube size={18} color={platform.color} />}
                {platform.name}
              </CardTitle>
              <CardDescription>API calls this month</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{platform.calls}</div>
                <div className="text-sm text-muted-foreground">
                  {Math.round((platform.calls / platform.quota) * 100)}% of quota
                </div>
              </div>
              <div className="mt-3 h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (platform.calls / platform.quota) * 100)}%`,
                    backgroundColor: platform.color
                  }}
                />
              </div>
              <div className="mt-1 text-xs text-right text-muted-foreground">
                Limit: {platform.quota}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="shadow-sm border dark:border-gray-700">
        <CardHeader className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <CardTitle className="text-xl font-semibold">Social Media API Usage Trends</CardTitle>
          <CardDescription>API calls over the last 7 months</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={socialApiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
                <Legend />
                <Line type="monotone" dataKey="facebook" stroke="#1877F2" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="twitter" stroke="#1DA1F2" strokeWidth={2} />
                <Line type="monotone" dataKey="instagram" stroke="#C13584" strokeWidth={2} />
                <Line type="monotone" dataKey="youtube" stroke="#FF0000" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaSection;
