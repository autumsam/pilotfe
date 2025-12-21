
import { useState } from "react";
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserCheck, UserX } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  plan: string;
  lastActive: string;
}

interface UserTableProps {
  users: User[];
  onUserAction: (action: string, userId: number) => void;
}

export const UserTable = ({ users, onUserAction }: UserTableProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500";
      case "Inactive":
        return "bg-gray-500";
      case "Suspended":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "Premium":
        return <Badge className="bg-purple-600">Premium</Badge>;
      case "Basic":
        return <Badge className="bg-blue-500">Basic</Badge>;
      case "Free":
        return <Badge variant="outline">Free</Badge>;
      default:
        return <Badge variant="outline">Free</Badge>;
    }
  };

  return (
    <>
      <Table>
        <TableCaption>A list of all users in the system.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <span className="flex items-center">
                  <span className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(user.status)}`}></span>
                  {user.status}
                </span>
              </TableCell>
              <TableCell>{getPlanBadge(user.plan)}</TableCell>
              <TableCell>{user.lastActive}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => {
                        setSelectedUser(user);
                        setIsUserDetailsOpen(true);
                      }}
                    >
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit user</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {user.status !== "Active" && (
                      <DropdownMenuItem onClick={() => onUserAction("activate", user.id)}>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Activate user
                      </DropdownMenuItem>
                    )}
                    {user.status !== "Suspended" && (
                      <DropdownMenuItem onClick={() => onUserAction("suspend", user.id)}>
                        <UserX className="mr-2 h-4 w-4" />
                        Suspend user
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* User Details Dialog */}
      <Dialog open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-2">
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
                  {selectedUser.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                {getPlanBadge(selectedUser.plan)}
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Role:</div>
                <div>{selectedUser.role}</div>
                <div className="font-medium">Status:</div>
                <div>
                  <span className={`inline-block h-2 w-2 rounded-full mr-1 ${getStatusColor(selectedUser.status)}`}></span>
                  {selectedUser.status}
                </div>
                <div className="font-medium">Last Active:</div>
                <div>{selectedUser.lastActive}</div>
                <div className="font-medium">Joined:</div>
                <div>Jan 15, 2023</div>
                <div className="font-medium">Posts Created:</div>
                <div>42</div>
                <div className="font-medium">Subscription:</div>
                <div>{selectedUser.plan} (Monthly)</div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsUserDetailsOpen(false)}>Close</Button>
                <Button>Edit User</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
