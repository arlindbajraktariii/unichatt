
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { 
  Archive, 
  Bell, 
  BookMarked, 
  Columns3, 
  LogOut, 
  Mail, 
  Plus, 
  Settings, 
  Star 
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean;
}

export function SidebarNav({ className, isCollapsed = false, ...props }: SidebarNavProps) {
  const { user, channels, unreadCount, logout } = useApp();
  
  const connectedChannels = channels.filter(channel => channel.is_connected);

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar text-sidebar-foreground",
        isCollapsed ? "w-[70px]" : "w-[240px]",
        className
      )}
      {...props}
    >
      <div className="px-4 py-6 flex items-center justify-center">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
          {!isCollapsed && <span className="font-bold text-xl">Nexus</span>}
        </Link>
      </div>

      <Separator className="bg-sidebar-border/30" />

      <nav className="flex-1 overflow-auto py-4">
        <div className="px-3 py-2">
          {!isCollapsed && <h2 className="mb-2 px-2 text-lg font-semibold">Main</h2>}
          <div className="space-y-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      "text-sidebar-foreground"
                    )}
                  >
                    <Columns3 className="h-5 w-5" />
                    {!isCollapsed && <span>Dashboard</span>}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">Dashboard</TooltipContent>}
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/messages"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      "text-sidebar-foreground"
                    )}
                  >
                    <Mail className="h-5 w-5" />
                    {!isCollapsed && <span>Messages</span>}
                    {unreadCount > 0 && (
                      <Badge className="ml-auto bg-nexus-violet text-white">
                        {unreadCount}
                      </Badge>
                    )}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">Messages ({unreadCount})</TooltipContent>}
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/starred"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      "text-sidebar-foreground"
                    )}
                  >
                    <Star className="h-5 w-5" />
                    {!isCollapsed && <span>Starred</span>}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">Starred</TooltipContent>}
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/archived"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      "text-sidebar-foreground"
                    )}
                  >
                    <Archive className="h-5 w-5" />
                    {!isCollapsed && <span>Archived</span>}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">Archived</TooltipContent>}
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/notifications"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      "text-sidebar-foreground"
                    )}
                  >
                    <Bell className="h-5 w-5" />
                    {!isCollapsed && <span>Notifications</span>}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">Notifications</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <Separator className="my-4 bg-sidebar-border/30" />

        <div className="px-3 py-2">
          {!isCollapsed && (
            <div className="flex items-center justify-between mb-2 px-2">
              <h2 className="text-lg font-semibold">Channels</h2>
              <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" asChild>
                <Link to="/add-channel">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Add Channel</span>
                </Link>
              </Button>
            </div>
          )}
          
          <div className="space-y-1">
            <TooltipProvider>
              {isCollapsed && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to="/add-channel"
                      className={cn(
                        "flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        "text-sidebar-foreground"
                      )}
                    >
                      <Plus className="h-5 w-5" />
                      <span className="sr-only">Add Channel</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Add Channel</TooltipContent>
                </Tooltip>
              )}
              
              {connectedChannels.map((channel) => {
                // Generate avatar placeholder for channel
                const avatarPlaceholder = `/public/logos/${channel.type}.svg`;
                
                return (
                <Tooltip key={channel.id}>
                  <TooltipTrigger asChild>
                    <Link
                      to={`/channel/${channel.id}`}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        "text-sidebar-foreground"
                      )}
                    >
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={avatarPlaceholder} alt={channel.name} />
                        <AvatarFallback>{channel.name[0]}</AvatarFallback>
                      </Avatar>
                      {!isCollapsed && <span>{channel.name}</span>}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && <TooltipContent side="right">{channel.name}</TooltipContent>}
                </Tooltip>
              )})}
            </TooltipProvider>
          </div>
        </div>
      </nav>

      <div className="mt-auto">
        <Separator className="bg-sidebar-border/30" />
        
        <div className="p-4">
          <TooltipProvider>
            <div className="flex items-center justify-between">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/settings"
                    className={cn(
                      "flex items-center rounded-lg p-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      "text-sidebar-foreground"
                    )}
                  >
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top">Settings</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/help"
                    className={cn(
                      "flex items-center rounded-lg p-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      "text-sidebar-foreground"
                    )}
                  >
                    <BookMarked className="h-5 w-5" />
                    <span className="sr-only">Help</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top">Help & Guides</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={logout}
                    className={cn(
                      "flex items-center rounded-lg p-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      "text-sidebar-foreground"
                    )}
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Logout</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Logout</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
          
          {!isCollapsed && user && (
            <div className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2">
              <Avatar>
                <AvatarImage src={user.avatar_url} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-0.5 text-xs">
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-sidebar-foreground/70">{user.email}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
