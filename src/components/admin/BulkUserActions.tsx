import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  CheckSquare, 
  UserCheck, 
  UserX, 
  Shield, 
  Trash2, 
  ChevronDown,
  Users
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  plan: string;
  lastActive: string;
}

interface BulkUserActionsProps {
  users: User[];
  selectedUsers: number[];
  onSelectUser: (userId: number) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkAction: (action: string, userIds: number[]) => void;
}

export const BulkUserActions = ({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onClearSelection,
  onBulkAction,
}: BulkUserActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) {
      toast.error("No users selected");
      return;
    }

    onBulkAction(action, selectedUsers);
    setIsOpen(false);
    
    const actionMessages: Record<string, string> = {
      activate: `Activated ${selectedUsers.length} user(s)`,
      suspend: `Suspended ${selectedUsers.length} user(s)`,
      makeAdmin: `Promoted ${selectedUsers.length} user(s) to Admin`,
      makeUser: `Changed ${selectedUsers.length} user(s) to User role`,
      delete: `Deleted ${selectedUsers.length} user(s)`,
    };

    toast.success(actionMessages[action] || "Action completed");
    onClearSelection();
  };

  const allSelected = users.length > 0 && selectedUsers.length === users.length;
  const someSelected = selectedUsers.length > 0 && selectedUsers.length < users.length;

  return (
    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={allSelected}
          onCheckedChange={() => {
            if (allSelected) {
              onClearSelection();
            } else {
              onSelectAll();
            }
          }}
          className="data-[state=checked]:bg-primary"
        />
        <span className="text-sm text-muted-foreground">
          {selectedUsers.length > 0 
            ? `${selectedUsers.length} selected` 
            : "Select all"}
        </span>
      </div>

      {selectedUsers.length > 0 && (
        <>
          <div className="h-4 w-px bg-border" />
          
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <CheckSquare className="h-4 w-4" />
                Bulk Actions
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>User Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleBulkAction("activate")}>
                <UserCheck className="mr-2 h-4 w-4 text-green-600" />
                Activate Users
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction("suspend")}>
                <UserX className="mr-2 h-4 w-4 text-amber-600" />
                Suspend Users
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Role Changes</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleBulkAction("makeAdmin")}>
                <Shield className="mr-2 h-4 w-4 text-purple-600" />
                Make Admin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction("makeUser")}>
                <Users className="mr-2 h-4 w-4 text-blue-600" />
                Make User
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleBulkAction("delete")}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Users
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearSelection}
            className="text-muted-foreground"
          >
            Clear
          </Button>
        </>
      )}
    </div>
  );
};