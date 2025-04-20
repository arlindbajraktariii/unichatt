
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { ChevronsLeft, ChevronsRight, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useApp();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if current user is admin
    const checkAdminStatus = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          console.error("Admin check error:", error);
          setIsAdmin(false);
        } else {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error("Admin check error:", err);
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [user]);
  
  const goToAdmin = () => {
    navigate('/dashboard/admin');
  };
  
  return <div className="flex h-screen overflow-hidden bg-gray-50">
      <SidebarNav expanded={!sidebarCollapsed} />
      
      <div className="relative flex-1 overflow-auto bg-white">
        {isAdmin && (
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
