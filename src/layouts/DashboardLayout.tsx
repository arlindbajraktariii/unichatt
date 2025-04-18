
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarNav } from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SidebarNav isCollapsed={sidebarCollapsed} />
      
      <div className="relative flex-1 overflow-auto">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-4 z-10 h-8 w-8 rounded-full bg-white shadow-md"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
        </Button>
        
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
