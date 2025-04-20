import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useApp();
  const navigate = useNavigate();
  const { isAdmin, isLoading, checkAdminStatus } = useAdmin();
  
  // Use effect is now handled by the useAdmin hook
  useEffect(() => {
    if (user?.id) {
      checkAdminStatus(user.id);
    }
  }, [user, checkAdminStatus]);
  
  const goToAdmin = () => {
    navigate('/dashboard/admin');
  };
  
  return <div className="flex h-screen overflow-hidden bg-gray-50">
      <SidebarNav expanded={!sidebarCollapsed} />
      
      <div className="relative flex-1 overflow-auto bg-white">
        {isAdmin && !isLoading && (
          <div className="absolute top-4 right-4 z-10">
            <Button 
              onClick={goToAdmin}
              variant="outline" 
              size="sm"
              className="flex items-center gap-1.5 border-amber-300 hover:bg-amber-50"
            >
              <Shield className="h-4 w-4 text-amber-500" />
              <span>Admin</span>
            </Button>
          </div>
        )}
        
        <main className="flex-1 bg-white">
          <Outlet />
        </main>
      </div>
    </div>;
};

export default DashboardLayout;
