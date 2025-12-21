
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Twitter, Facebook, Instagram, Bot } from "lucide-react";

export const ApiUsageCard = () => {
  const apiUsage = [
    { 
      name: "Twitter API", 
      used: 2450, 
      limit: 3000, 
      icon: <Twitter className="h-4 w-4" />,
      percentUsed: 82
    },
    { 
      name: "Facebook API", 
      used: 1250, 
      limit: 2000, 
      icon: <Facebook className="h-4 w-4" />,
      percentUsed: 62
    },
    { 
      name: "Instagram API", 
      used: 1850, 
      limit: 2000, 
      icon: <Instagram className="h-4 w-4" />,
      percentUsed: 92
    },
    { 
      name: "AI Generation", 
      used: 85, 
      limit: 100, 
      icon: <Bot className="h-4 w-4" />,
      percentUsed: 85
    }
  ];

  const getStatusColor = (percentUsed: number) => {
    if (percentUsed > 90) return "bg-red-500";
    if (percentUsed > 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">API Usage</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription>Current API usage metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {apiUsage.map((api, i) => (
            <div key={i} className="flex items-center justify-between pb-2 border-b border-border last:border-0 last:pb-0">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{api.icon}</span>
                <span className="text-sm font-medium">{api.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm font-medium">{api.used} / {api.limit}</p>
                  <p className="text-xs text-muted-foreground">{api.percentUsed}% used</p>
                </div>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusColor(api.percentUsed) }}></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
