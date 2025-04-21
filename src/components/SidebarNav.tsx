
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Plus, Bell, Star, Archive, Settings, HelpCircle, LogOut, PlusCircle, ChevronRight, User, Ticket, Info } from 'lucide-react';
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
  const { toast } = useToast();

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

  return (
    <div className={`flex flex-col h-full bg-white text-slate-700 border-r border-slate-200 font-colvetica ${sidebarExpanded ? 'w-64' : 'w-16'}`}>
      <div className="p-3 flex items-center justify-between mx-0 my-0 py-[10px] bg-white text-[#000]">
        {sidebarExpanded ? (
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">Unichat</span>
          </div>
        ) : (
          <img src="/logo.svg" alt="Unichat Logo" className="w-8 h-8 mx-auto" />
        )}
        <Button variant="ghost" size="icon" onClick={() => setSidebarExpanded(!sidebarExpanded)} className="text-[#000] hover:bg-slate-100">
          <ChevronRight className={`h-5 w-5 ${sidebarExpanded ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          <div className={`mt-3 mb-2 ${sidebarExpanded ? 'flex justify-between items-center' : 'text-center'}`}>
            {sidebarExpanded ? (
              <>
                <span className="text-sm font-medium text-slate-500 uppercase px-2">Channels</span>
                <Button variant="ghost" size="icon" onClick={handleAddChannel} className="h-6 w-6 text-slate-500 rounded-full hover:bg-slate-100">
                  <Plus className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleAddChannel} className="h-6 w-6 mx-auto text-slate-500 hover:bg-slate-100 rounded-full">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Add Channel
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          {connectedChannels.length > 0 ? (
            <div className="space-y-1">
              {connectedChannels.map(channel => (
                <ChannelItem 
                  key={channel.id} 
                  channel={channel} 
                  expanded={sidebarExpanded} 
                  isActive={currentChannel === channel.id} 
                  onClick={() => {
                    setCurrentChannel(channel.id);
                    navigate(`/dashboard/channel/${channel.id}`);
                  }} 
                />
              ))}
            </div>
          ) : (
            <div className={sidebarExpanded ? "p-2 text-sm text-slate-500 text-center" : ""}>
              {sidebarExpanded && <p>No channels connected yet</p>}
              <Button 
                variant="outline" 
                size={sidebarExpanded ? "default" : "icon"} 
                onClick={handleAddChannel} 
                className="mx-auto my-2 border-[#09090b] bg-white text-slate-700 hover:bg-slate-50"
              >
                {sidebarExpanded ? (
                  <>
                    <PlusCircle className="h-4 w-4 mr-2 text-[#09090b]" />
                    Connect Channel
                  </>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <PlusCircle className="h-4 w-4 text-[#09090b]" />
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        Connect Channel
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </Button>
            </div>
          )}

          <Separator className="my-2 bg-slate-200" />

          <div className="space-y-1 pt-2">
            <NavMenuItem 
              to="/dashboard/starred" 
              icon={Star} 
              label="Starred" 
              expanded={sidebarExpanded} 
            />
            
            <NavMenuItem 
              to="/dashboard/archived" 
              icon={Archive} 
              label="Archived" 
              expanded={sidebarExpanded} 
            />

            <NavMenuItem 
              to="/dashboard/profile" 
              icon={User} 
              label="Profile" 
              expanded={sidebarExpanded} 
            />

            <NavMenuItem 
              to="/dashboard/tickets" 
              icon={Ticket} 
              label="Support Tickets" 
              expanded={sidebarExpanded} 
            />
            
            <NavMenuItem 
              to="/pricing" 
              icon={Info} 
              label="Pricing" 
              expanded={sidebarExpanded} 
            />
            
            <NavMenuItem 
              to="/dashboard/settings" 
              icon={Settings} 
              label="Settings" 
              expanded={sidebarExpanded} 
            />
            
            <NavMenuItem 
              to="/dashboard/help" 
              icon={HelpCircle} 
              label="Help" 
              expanded={sidebarExpanded} 
            />
          </div>
        </div>
      </ScrollArea>

      <div className="p-3 mt-auto border-t border-slate-200 bg-white">
        {sidebarExpanded ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={user?.avatar_url} />
                <AvatarFallback className="bg-[#09090b]/10 text-[#09090b]">
                  {user ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-700">{user?.name || 'User'}</span>
                <span className="text-xs truncate max-w-[140px] text-slate-500">
                  {user?.email || 'user@example.com'}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-500 hover:bg-slate-100">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar_url} />
              <AvatarFallback className="bg-[#09090b]/10 text-[#09090b]">
                {user ? getInitials(user.name) : 'U'}
              </AvatarFallback>
            </Avatar>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-500 hover:bg-slate-100">
                    <LogOut className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Logout
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for navigation menu items
const NavMenuItem = ({ 
  to, 
  icon: Icon, 
  label, 
  expanded 
}: { 
  to: string; 
  icon: React.FC<any>; 
  label: string; 
  expanded: boolean 
}) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `
        flex items-center p-2 rounded-md transition-colors
        ${isActive ? 'bg-[#09090b]/5 text-[#09090b]' : 'hover:bg-slate-100'}
      `}
    >
      {expanded ? (
        <>
          <Icon className="h-5 w-5 mr-3 text-slate-500" />
          <span>{label}</span>
        </>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Icon className="h-5 w-5 mx-auto text-slate-500" />
            </TooltipTrigger>
            <TooltipContent side="right">
              {label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </NavLink>
  );
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
  return (
    <button 
      onClick={onClick} 
      className={`
        w-full flex items-center p-2 rounded-md transition-colors
        ${isActive ? 'bg-[#09090b]/5 text-[#09090b]' : 'hover:bg-slate-100'}
      `}
    >
      {expanded ? (
        <>
          <div className="h-5 w-5 mr-3 flex-shrink-0">
            <img src={getChannelIcon(channel.type)} alt={channel.type} className="h-full w-full object-contain" />
          </div>
          <span className="truncate">{channel.name}</span>
        </>
      ) : (
        <TooltipProvider>
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
        </TooltipProvider>
      )}
    </button>
  );
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
