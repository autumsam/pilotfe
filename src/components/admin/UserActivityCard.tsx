
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users } from "lucide-react";

export const UserActivityCard = () => {
  const activities = [
    { user: "Jane Cooper", action: "Created a post", time: "2 minutes ago" },
    { user: "Robert Fox", action: "Updated profile", time: "15 minutes ago" },
    { user: "Wade Warren", action: "Scheduled 3 posts", time: "1 hour ago" },
    { user: "Esther Howard", action: "Logged in", time: "2 hours ago" },
    { user: "Cameron Williamson", action: "Uploaded media", time: "5 hours ago" }
  ];

  return (
    <Card className="h-full w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription>Latest user activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, i) => (
            <div key={i} className="flex items-start gap-2 pb-2 border-b border-border last:border-0 last:pb-0">
              <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {activity.user.charAt(0)}
              </div>
              <div className="space-y-0.5 min-w-0">
                <p className="text-sm font-medium truncate">{activity.user}</p>
                <p className="text-xs text-muted-foreground truncate">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
