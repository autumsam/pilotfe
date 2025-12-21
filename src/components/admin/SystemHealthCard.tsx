
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Shield, Server, Database, MemoryStick } from "lucide-react";

export const SystemHealthCard = () => {
  const metrics = [
    { 
      name: "Server Uptime", 
      value: "99.9%", 
      icon: <Server className="h-4 w-4" />,
      status: "Healthy",
      color: "text-green-500"
    },
    { 
      name: "Database Load", 
      value: "45%", 
      icon: <Database className="h-4 w-4" />,
      progress: 45,
      status: "Normal",
      color: "text-green-500"
    },
    { 
      name: "Memory Usage", 
      value: "68%", 
      icon: <MemoryStick className="h-4 w-4" />,
      progress: 68,
      status: "Moderate",
      color: "text-yellow-500"
    },
    { 
      name: "Security Status", 
      value: "Protected", 
      icon: <Shield className="h-4 w-4" />,
      status: "Secure",
      color: "text-green-500"
    }
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">System Health</CardTitle>
        <CardDescription>Current system metrics and status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{metric.icon}</span>
                  <span className="text-sm font-medium">{metric.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{metric.value}</span>
                  {metric.status && (
                    <span className={`text-xs ${metric.color}`}>
                      {metric.status}
                    </span>
                  )}
                </div>
              </div>
              {metric.progress && <Progress value={metric.progress} className="h-2" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
