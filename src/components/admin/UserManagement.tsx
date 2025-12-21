
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { UserTable } from "./UserTable";
import { UserFilters } from "./UserFilters";
import { AddUserDialog } from "./AddUserDialog";
import { toast } from "sonner";

// Define the props interface for UserManagement component
interface UserManagementProps {
  searchQuery?: string;
  filterRole?: string;
  filterStatus?: string;
}

// Sample user data
const sampleUsers = [
  { 
    id: 1, 
    name: "Jane Cooper", 
    email: "jane@example.com", 
    role: "Admin", 
    status: "Active", 
    plan: "Premium", 
    lastActive: "5 mins ago" 
  },
  { 
    id: 2, 
    name: "Robert Fox", 
    email: "robert@example.com", 
    role: "User", 
    status: "Active", 
    plan: "Basic", 
    lastActive: "1 hour ago" 
  },
  { 
    id: 3, 
    name: "Wade Warren", 
    email: "wade@example.com", 
    role: "User", 
    status: "Inactive", 
    plan: "Free", 
    lastActive: "3 days ago" 
  },
  { 
    id: 4, 
    name: "Esther Howard", 
    email: "esther@example.com", 
    role: "Editor", 
    status: "Active", 
    plan: "Premium", 
    lastActive: "Just now" 
  },
  { 
    id: 5, 
    name: "Cameron Williamson", 
    email: "cameron@example.com", 
    role: "User", 
    status: "Suspended", 
    plan: "Basic", 
    lastActive: "1 week ago" 
  }
];

const UserManagement = ({ searchQuery = "", filterRole = "all", filterStatus = "all" }: UserManagementProps) => {
  const [users, setUsers] = useState(sampleUsers);
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [currentFilterRole, setCurrentFilterRole] = useState(filterRole);
  const [currentFilterStatus, setCurrentFilterStatus] = useState(filterStatus);

  // Filter users based on search term, role and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm ? (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    ) : true;
    
    const matchesRole = currentFilterRole === "all" || user.role.toLowerCase() === currentFilterRole.toLowerCase();
    const matchesStatus = currentFilterStatus === "all" || user.status.toLowerCase() === currentFilterStatus.toLowerCase();
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUserAction = (action: string, userId: number) => {
    // Here you would implement the actual logic for these actions
    console.log(`Action ${action} on user ${userId}`);
    
    if (action === "activate" || action === "suspend") {
      const newStatus = action === "activate" ? "Active" : "Suspended";
      setUsers(users.map(u => u.id === userId ? {...u, status: newStatus} : u));
      toast.success(`User ${action === "activate" ? "activated" : "suspended"} successfully`);
    }
  };

  const handleExportData = () => {
    toast.success("User data exported successfully");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="w-full sm:w-auto">
          <UserFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterRole={currentFilterRole}
            setFilterRole={setCurrentFilterRole}
            filterStatus={currentFilterStatus}
            setFilterStatus={setCurrentFilterStatus}
            hideSearchBox={!!searchQuery}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <AddUserDialog />
        </div>
      </div>
      
      <Card className="w-full">
        <CardContent className="p-0">
          <UserTable users={filteredUsers} onUserAction={handleUserAction} />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
