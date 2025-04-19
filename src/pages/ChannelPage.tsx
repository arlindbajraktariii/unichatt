import { useParams, Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import MessageList from "@/components/MessageList";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BellOff, Settings, Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";
const ChannelPage = () => {
  const {
    channelId
  } = useParams<{
    channelId: string;
  }>();
  const {
    channels,
    messages,
    disconnectChannel
  } = useApp();
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);

  // Find the channel
  const channel = channels.find(c => c.id === channelId);

  // Filter messages for this channel
  const channelMessages = messages.filter(m => m.channel_id === channelId);
  if (!channel) {
    return <div className="container mx-auto py-6 max-w-7xl bg-white">
        <div className="flex items-center mb-6">
          <Link to="/messages">
            <Button variant="outline" size="icon" className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Channel Not Found</h1>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm p-8 text-center">
          <p className="text-gray-500 mb-4">The channel you are looking for does not exist or has been disconnected.</p>
          <Link to="/messages">
            <Button>Go Back to Messages</Button>
          </Link>
        </div>
      </div>;
  }
  if (!channel.is_connected) {
    return <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex items-center mb-6">
          <Link to="/messages">
            <Button variant="outline" size="icon" className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{channel.name}</h1>
            <p className="text-muted-foreground">
              This channel is disconnected
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm p-8 text-center">
          <p className="text-gray-500 mb-4">This channel is currently disconnected. Reconnect to view messages.</p>
          <Link to="/add-channel">
            <Button>Connect a Channel</Button>
          </Link>
        </div>
      </div>;
  }
  const handleDisconnect = () => {
    disconnectChannel(channelId!);
    setShowDisconnectDialog(false);
  };
  return <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-start md:items-center mb-6 flex-col md:flex-row gap-4">
        <div className="flex items-center">
          <Link to="/messages">
            <Button variant="outline" size="icon" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center">
            <img src={channel.avatar} alt={channel.name} className="h-10 w-10 mr-3" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{channel.name}</h1>
              <p className="text-muted-foreground">
                {channel.type} · Last synced: {new Date(channel.last_sync || "").toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <BellOff className="h-4 w-4 mr-2" />
            Mute
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Disconnect Channel</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to disconnect this channel? You will no longer receive messages from {channel.name}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDisconnect}>
                  Disconnect
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm min-h-[500px]">
        <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
          {channelMessages.length > 0 ? <MessageList messages={channelMessages} channelId={channelId} /> : <div className="flex flex-col items-center justify-center h-[400px] text-center text-gray-500 p-8">
              <img src={channel.avatar} alt={channel.name} className="h-16 w-16 mb-4 opacity-20" />
              <h3 className="text-lg font-medium">No messages yet</h3>
              <p className="text-sm max-w-md mt-2">
                You haven't received any messages from this channel yet. Messages will appear here as they come in.
              </p>
            </div>}
        </div>
      </div>
    </div>;
};
export default ChannelPage;