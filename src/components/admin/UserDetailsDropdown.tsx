import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Loader2, Facebook, Twitter, Instagram, Linkedin, Video, BarChart } from "lucide-react";
import userApi from "@/services/userApi";
import type { UserDetailedInfo } from "@/types/subscription";
import { toast } from "sonner";

interface UserDetailsDropdownProps {
  userId: number;
  username: string;
}

export const UserDetailsDropdown = ({ userId, username }: UserDetailsDropdownProps) => {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<UserDetailedInfo | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && !details) {
      loadDetails();
    }
  }, [open]);

  const loadDetails = async () => {
    try {
      setLoading(true);
      const data = await userApi.getUserDetailedInfo(userId);
      setDetails(data);
    } catch (error) {
      console.error("Error loading user details:", error);
      toast.error("Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      case 'tiktok':
        return <Video className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          Details
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-semibold">
          User Details - {username}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : details ? (
          <div className="space-y-3 p-2">
            {/* Statistics */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase">Statistics</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded text-xs">
                  <span>Posts</span>
                  <Badge variant="secondary">{details.total_posts}</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded text-xs">
                  <span>API Calls</span>
                  <Badge variant="secondary">{details.api_calls_count}</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded text-xs">
                  <span>AI Usage</span>
                  <Badge variant="secondary">{details.ai_usage_count}</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded text-xs">
                  <span>Accounts</span>
                  <Badge variant="secondary">{details.social_connections.length}</Badge>
                </div>
              </div>
            </div>

            {/* Social Connections */}
            {details.social_connections.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground uppercase">Connected Accounts</div>
                  <div className="space-y-1">
                    {details.social_connections.map((conn) => (
                      <div
                        key={conn.id}
                        className="flex items-center justify-between p-2 bg-muted/30 rounded text-xs"
                      >
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(conn.platform)}
                          <span className="font-medium capitalize">{conn.platform}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            @{conn.platform_username || 'N/A'}
                          </span>
                          <Badge
                            variant={conn.is_active ? "success" : "secondary"}
                            className="text-xs"
                          >
                            {conn.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Last Login */}
            {details.last_login && (
              <>
                <DropdownMenuSeparator />
                <div className="text-xs">
                  <span className="text-muted-foreground">Last Login: </span>
                  <span className="font-medium">
                    {new Date(details.last_login).toLocaleString()}
                  </span>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No details available
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

