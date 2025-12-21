import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  UserMinus, 
  UserCheck, 
  UserX, 
  Shield, 
  Settings, 
  Key,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";

export interface AuditLog {
  id: string;
  timestamp: Date;
  action: string;
  actionType: "user" | "system" | "security" | "settings";
  actor: string;
  target?: string;
  details: string;
  severity: "info" | "warning" | "critical";
  ip?: string;
}

interface AuditLogEntryProps {
  log: AuditLog;
}

const getActionIcon = (actionType: string, action: string) => {
  const iconClass = "h-4 w-4";
  
  switch (action) {
    case "user_created":
      return <UserPlus className={`${iconClass} text-green-600`} />;
    case "user_deleted":
      return <UserMinus className={`${iconClass} text-red-600`} />;
    case "user_activated":
      return <UserCheck className={`${iconClass} text-green-600`} />;
    case "user_suspended":
      return <UserX className={`${iconClass} text-amber-600`} />;
    case "role_changed":
      return <Shield className={`${iconClass} text-purple-600`} />;
    case "settings_updated":
      return <Settings className={`${iconClass} text-blue-600`} />;
    case "login_failed":
      return <AlertTriangle className={`${iconClass} text-red-600`} />;
    case "api_key_generated":
      return <Key className={`${iconClass} text-amber-600`} />;
    default:
      return <Info className={`${iconClass} text-muted-foreground`} />;
  }
};

const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case "critical":
      return <Badge variant="destructive" className="text-xs">Critical</Badge>;
    case "warning":
      return <Badge className="bg-amber-500 hover:bg-amber-600 text-xs">Warning</Badge>;
    default:
      return <Badge variant="secondary" className="text-xs">Info</Badge>;
  }
};

export const AuditLogEntry = ({ log }: AuditLogEntryProps) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="flex items-start gap-4 p-4 border-b last:border-0 hover:bg-muted/30 transition-colors">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
        {getActionIcon(log.actionType, log.action)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium">{log.actor}</span>
          <span className="text-muted-foreground text-sm">{log.details}</span>
          {log.target && (
            <span className="text-primary font-medium">{log.target}</span>
          )}
        </div>
        
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span>{formatDate(log.timestamp)}</span>
          <span>{formatTime(log.timestamp)}</span>
          {log.ip && <span>IP: {log.ip}</span>}
        </div>
      </div>
      
      <div className="flex-shrink-0">
        {getSeverityBadge(log.severity)}
      </div>
    </div>
  );
};