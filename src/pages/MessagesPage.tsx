
import { useApp } from "@/context/AppContext";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MessageList from "@/components/MessageList";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MessagesPage = () => {
  const { messages, channels } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get filter from URL params
  const params = new URLSearchParams(location.search);
  const urlFilter = params.get("filter") || "all";
  
  const [filter, setFilter] = useState(urlFilter);
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Update URL when filter changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (filter !== "all") {
      params.set("filter", filter);
    }
    
    navigate({ search: params.toString() }, { replace: true });
  }, [filter, navigate]);
  
  // Filter messages
  let filteredMessages = [...messages];
  
  // First apply filter type
  if (filter === "unread") {
    filteredMessages = filteredMessages.filter(message => message.status === "unread");
  } else if (filter === "starred") {
    filteredMessages = filteredMessages.filter(message => message.isStarred);
  } else if (filter === "archived") {
    filteredMessages = filteredMessages.filter(message => message.status === "archived");
  }
  
  // Then apply channel filter
  if (channelFilter !== "all") {
    filteredMessages = filteredMessages.filter(message => message.channelId === channelFilter);
  }
  
  // Finally apply search term
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredMessages = filteredMessages.filter(
      message => 
        message.content.toLowerCase().includes(term) || 
        message.senderName.toLowerCase().includes(term)
    );
  }
  
  // Get active channels for filter
  const activeChannels = channels.filter(channel => channel.isConnected);

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            View and manage all your messages in one place
          </p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-2">
          <div className="relative w-full md:w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search messages..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select 
            value={channelFilter}
            onValueChange={setChannelFilter}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Channels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              {activeChannels.map(channel => (
                <SelectItem key={channel.id} value={channel.id}>
                  {channel.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs 
        defaultValue={filter} 
        value={filter} 
        onValueChange={setFilter}
        className="mb-6"
      >
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="starred">Starred</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="bg-white rounded-lg border shadow-sm min-h-[500px]">
        <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
          <MessageList 
            messages={filteredMessages}
            filter={filter !== "all" ? filter : undefined}
            channelId={channelFilter !== "all" ? channelFilter : undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
