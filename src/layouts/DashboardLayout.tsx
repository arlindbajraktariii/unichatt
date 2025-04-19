import { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return <div className="flex h-screen overflow-hidden bg-gray-50">
      <SidebarNav expanded={!sidebarCollapsed} />
      
      <div className="relative flex-1 overflow-auto bg-amber-50">
        
        
        <main className="flex-1 bg-amber-50">
          <Outlet />
        </main>
      </div>
    </div>;
};
export default DashboardLayout;