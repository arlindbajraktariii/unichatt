import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import MessageList from "@/components/MessageList";
import DashboardStats from "@/components/DashboardStats";
const Dashboard = () => {
  const {
    channels,
    messages,
    unreadCount
  } = useApp();
  const connectedChannels = channels.filter(channel => channel.is_connected);
  const unreadMessages = messages.filter(message => message.status === "unread");
  return <div className="container mx-auto py-6 max-w-7xl bg-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage all your communication channels in one place
          </p>
        </div>
        
        <Link to="/add-channel">
          <Button className="rounded-lg bg-[#4ad66d]">
            <Plus className="mr-2 h-4 w-4" />
            Add Channel
          </Button>
        </Link>
      </div>
      
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-white">
            <div>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>
                Your latest conversations across all channels
              </CardDescription>
            </div>
            
            <Link to="/messages">
              <Button variant="outline" size="sm" className="h-8">
                View All
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="bg-white">
            {messages.length > 0 ? <div className="max-h-[500px] overflow-y-auto pr-1">
                <MessageList messages={messages.slice(0, 5)} />
              </div> : <div className="flex flex-col items-center justify-center h-[200px] text-center text-gray-500">
                <p className="text-sm max-w-md">
                  No messages yet. Connect a channel to start receiving messages.
                </p>
                <Link to="/add-channel" className="mt-4">
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Channel
                  </Button>
                </Link>
              </div>}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="bg-white">
            <CardTitle>Your Channels</CardTitle>
            <CardDescription>
              Connected communication platforms
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            {connectedChannels.length > 0 ? <div className="space-y-4">
                {connectedChannels.map(channel => <div key={channel.id} className="flex items-center p-3 rounded-md border hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 mr-3">
                      <img src={channel.avatar} alt={channel.name} className="h-10 w-10" />
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium">{channel.name}</div>
                      <div className="text-xs text-gray-500">{channel.type}</div>
                    </div>
                    <Link to={`/channel/${channel.id}`}>
                      <Button variant="ghost" size="icon" className="flex-shrink-0">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>)}
                
                <Link to="/add-channel">
                  <Button variant="outline" className="w-full mt-2">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Channel
                  </Button>
                </Link>
              </div> : <div className="flex flex-col items-center justify-center h-[200px] text-center text-gray-500">
                <p className="text-sm max-w-md">
                  No channels connected yet. Add your first communication channel to get started.
                </p>
                <Link to="/add-channel" className="mt-4">
                  <Button className="bg-[#ef8354]">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Channel
                  </Button>
                </Link>
              </div>}
          </CardContent>
        </Card>
      </div>
      
      {unreadCount > 0 && <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Unread Messages</CardTitle>
              <CardDescription>
                You have {unreadCount} unread {unreadCount === 1 ? "message" : "messages"}
              </CardDescription>
            </div>
            
            <Link to="/messages?filter=unread">
              <Button variant="outline" size="sm" className="h-8">
                View All Unread
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="max-h-[400px] overflow-y-auto pr-1">
              <MessageList messages={unreadMessages.slice(0, 3)} filter="unread" />
            </div>
          </CardContent>
        </Card>}
    </div>;
};
export default Dashboard;