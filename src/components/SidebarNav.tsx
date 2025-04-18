import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Plus, Bell, Star, Archive, Cog, HelpCircle, LogOut, PlusCircle, ChevronRight, User, Ticket } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useApp } from '../context/AppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChannelConnection } from '@/types';
import { useToast } from '@/hooks/use-toast';
interface SidebarNavProps {
  expanded?: boolean;
}
const SidebarNav: React.FC<SidebarNavProps> = ({
  expanded: isExpanded = true
}) => {
  const {
    user,
    channels,
    logout,
    currentChannel,
    setCurrentChannel,
    unreadCount
  } = useApp();
  const [sidebarExpanded, setSidebarExpanded] = useState(isExpanded);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleAddChannel = () => {
    navigate('/dashboard/add-channel');
  };
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account."
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive"
      });
    }
  };
  const connectedChannels = channels.filter(channel => channel.is_connected);
  const getInitials = (name: string) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };
  return <div className={`flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border font-colvetica ${sidebarExpanded ? 'w-64' : 'w-16'}`}>
      <div className="p-3 flex items-center justify-between border-b border-sidebar-border bg-zinc-950">
        {sidebarExpanded ? <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Nexus Logo" className="w-8 h-8" />
            <span className="font-bold text-lg">Nexus</span>
          </div> : <img src="/logo.svg" alt="Nexus Logo" className="w-8 h-8 mx-auto" />}
        <Button variant="ghost" size="icon" onClick={() => setSidebarExpanded(!sidebarExpanded)} className="text-sidebar-foreground hover:bg-sidebar-accent">
          <ChevronRight className={`h-5 w-5 ${sidebarExpanded ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      <ScrollArea className="flex-1 bg-zinc-950">
        <div className="space-y-1">
          <NavLink to="/dashboard" className={({
          isActive
        }) => `flex items-center p-2 rounded-md transition-colors ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'}`} end>
            {sidebarExpanded ? <>
                <MessageSquare className="h-5 w-5 mr-3" />
                <span>Dashboard</span>
              </> : <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <MessageSquare className="h-5 w-5 mx-auto" />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Dashboard
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>}
          </NavLink>

          <div className={`mt-3 mb-2 ${sidebarExpanded ? 'flex justify-between items-center' : 'text-center'}`}>
            {sidebarExpanded ? <>
                <span className="font-medium text-sm text-sidebar-foreground/70">CHANNELS</span>
                <Button variant="ghost" size="icon" onClick={handleAddChannel} className="h-6 w-6 text-sidebar-foreground hover:bg-sidebar-accent rounded-full">
                  <Plus className="h-4 w-4" />
                </Button>
              </> : <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleAddChannel} className="h-6 w-6 mx-auto text-sidebar-foreground hover:bg-sidebar-accent rounded-full">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Add Channel
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>}
          </div>

          {connectedChannels.length > 0 ? <div className="space-y-1">
              {connectedChannels.map(channel => <ChannelItem key={channel.id} channel={channel} expanded={sidebarExpanded} isActive={currentChannel === channel.id} onClick={() => {
            setCurrentChannel(channel.id);
            navigate(`/dashboard/channel/${channel.id}`);
          }} />)}
            </div> : <div className={sidebarExpanded ? "p-2 text-sm text-sidebar-foreground/60 text-center" : ""}>
              {sidebarExpanded && <p>No channels connected yet</p>}
              <Button variant="outline" size={sidebarExpanded ? "default" : "icon"} onClick={handleAddChannel} className={`mt-2 ${sidebarExpanded ? 'w-full' : 'mx-auto'} border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`}>
                {sidebarExpanded ? <>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Connect Channel
                  </> : <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <PlusCircle className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        Connect Channel
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>}
              </Button>
            </div>}

          <Separator className="my-4 bg-sidebar-border" />

          <div className="pt-2 space-y-1 bg-transparent">
            <NavLink to="/dashboard/notifications" className="">
              {sidebarExpanded ? <>
                  <div className="relative">
                    <Bell className="h-5 w-5 mr-3" />
                    {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-amber-400 text-black text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>}
                  </div>
                  <span className="text-slate-50">Notifications</span>
                </> : <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative mx-auto">
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-amber-400 text-black text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      Notifications
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>}
            </NavLink>
            
            <NavLink to="/dashboard/starred" className={({
            isActive
          }) => `flex items-center p-2 rounded-md transition-colors ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'}`}>
              {sidebarExpanded ? <>
                  <Star className="h-5 w-5 mr-3" />
                  <span>Starred</span>
                </> : <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Star className="h-5 w-5 mx-auto" />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      Starred
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>}
            </NavLink>
            
            <NavLink to="/dashboard/archived" className={({
            isActive
          }) => `flex items-center p-2 rounded-md transition-colors ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'}`}>
              {sidebarExpanded ? <>
                  <Archive className="h-5 w-5 mr-3" />
                  <span>Archived</span>
                </> : <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Archive className="h-5 w-5 mx-auto" />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      Archived
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>}
            </NavLink>

            <NavLink to="/dashboard/profile" className={({
            isActive
          }) => `flex items-center p-2 rounded-md transition-colors ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'}`}>
              {sidebarExpanded ? <>
                  <User className="h-5 w-5 mr-3" />
                  <span>Profile</span>
                </> : <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <User className="h-5 w-5 mx-auto" />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      Profile
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>}
            </NavLink>

            <NavLink to="/dashboard/tickets" className={({
            isActive
          }) => `flex items-center p-2 rounded-md transition-colors ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'}`}>
              {sidebarExpanded ? <>
                  <Ticket className="h-5 w-5 mr-3" />
                  <span>Support Tickets</span>
                </> : <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Ticket className="h-5 w-5 mx-auto" />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      Support Tickets
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>}
            </NavLink>
            
            <NavLink to="/pricing" className={({
            isActive
          }) => `flex items-center p-2 rounded-md transition-colors ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'}`}>
              {sidebarExpanded ? <>
                  <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm1 15h-2v-6h2v6zm0-8h-2v-2h2v2z" />
                  </svg>
                  <span>Pricing</span>
                </> : <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <svg className="h-5 w-5 mx-auto" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm1 15h-2v-6h2v6zm0-8h-2v-2h2v2z" />
                      </svg>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      Pricing
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>}
            </NavLink>
            
            <NavLink to="/dashboard/settings" className={({
            isActive
          }) => `flex items-center p-2 rounded-md transition-colors ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'}`}>
              {sidebarExpanded ? <>
                  <Cog className="h-5 w-5 mr-3" />
                  <span>Settings</span>
                </> : <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Cog className="h-5 w-5 mx-auto" />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      Settings
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>}
            </NavLink>
            
            <NavLink to="/dashboard/help" className={({
            isActive
          }) => `flex items-center p-2 rounded-md transition-colors ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'}`}>
              {sidebarExpanded ? <>
                  <HelpCircle className="h-5 w-5 mr-3" />
                  <span>Help</span>
                </> : <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-5 w-5 mx-auto" />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      Help
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>}
            </NavLink>
          </div>
        </div>
      </ScrollArea>

      <div className="p-3  mt-auto bg-zinc-950">
        {sidebarExpanded ? <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={user?.avatar_url} />
                <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                  {user ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.name || 'User'}</span>
                <span className="text-xs text-sidebar-foreground/70 truncate max-w-[140px]">
                  {user?.email || 'user@example.com'}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <LogOut className="h-5 w-5" />
            </Button>
          </div> : <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar_url} />
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                {user ? getInitials(user.name) : 'U'}
              </AvatarFallback>
            </Avatar>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleLogout} className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                    <LogOut className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Logout
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>}
      </div>
    </div>;
};
interface ChannelItemProps {
  channel: ChannelConnection;
  expanded: boolean;
  isActive: boolean;
  onClick: () => void;
}
const ChannelItem: React.FC<ChannelItemProps> = ({
  channel,
  expanded,
  isActive,
  onClick
}) => {
  return <button onClick={onClick} className={`w-full flex items-center p-2 rounded-md transition-colors ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'}`}>
      {expanded ? <>
          <div className="h-5 w-5 mr-3 flex-shrink-0">
            <img src={getChannelIcon(channel.type)} alt={channel.type} className="h-full w-full object-contain" />
          </div>
          <span className="truncate">{channel.name}</span>
        </> : <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-5 w-5 mx-auto flex-shrink-0">
                <img src={getChannelIcon(channel.type)} alt={channel.type} className="h-full w-full object-contain" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              {channel.name}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>}
    </button>;
};

// Helper function
const getChannelIcon = (channelType: string) => {
  const logoMap: Record<string, string> = {
    slack: '/logos/slack.svg',
    discord: '/logos/discord.svg',
    teams: '/logos/teams.svg',
    gmail: '/logos/gmail.svg',
    twitter: '/logos/twitter.svg',
    linkedin: '/logos/linkedin.svg'
  };
  return logoMap[channelType] || '/placeholder.svg';
};
export default SidebarNav;