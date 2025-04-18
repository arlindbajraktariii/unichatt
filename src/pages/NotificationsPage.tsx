
import { useApp } from "@/context/AppContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { BellOff, BellRing, Volume2, Mail } from "lucide-react";

const NotificationsPage = () => {
  const { notificationSettings, updateNotificationSettings, channels } = useApp();
  
  // Initialize state with current settings
  const [enablePush, setEnablePush] = useState(notificationSettings?.enablePush || false);
  const [enableEmail, setEnableEmail] = useState(notificationSettings?.enableEmail || false);
  const [enableSound, setEnableSound] = useState(notificationSettings?.enableSound || false);
  const [mutedChannels, setMutedChannels] = useState<string[]>(notificationSettings?.mutedChannels || []);
  
  // Connected channels
  const connectedChannels = channels.filter(channel => channel.isConnected);
  
  // Handle toggling channel mute
  const toggleChannelMute = (channelId: string) => {
    const newMutedChannels = mutedChannels.includes(channelId)
      ? mutedChannels.filter(id => id !== channelId)
      : [...mutedChannels, channelId];
    
    setMutedChannels(newMutedChannels);
    updateNotificationSettings({ mutedChannels: newMutedChannels });
  };
  
  // Handle toggle for push notifications
  const handlePushToggle = (checked: boolean) => {
    setEnablePush(checked);
    updateNotificationSettings({ enablePush: checked });
  };
  
  // Handle toggle for email notifications
  const handleEmailToggle = (checked: boolean) => {
    setEnableEmail(checked);
    updateNotificationSettings({ enableEmail: checked });
  };
  
  // Handle toggle for sound notifications
  const handleSoundToggle = (checked: boolean) => {
    setEnableSound(checked);
    updateNotificationSettings({ enableSound: checked });
  };
  
  if (!notificationSettings) {
    return (
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center">
              <p>Loading notification settings...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Manage how and when you receive notifications
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Configure how you want to be notified about new messages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <BellRing className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <Label htmlFor="push-notifications" className="font-medium">
                    Push Notifications
                  </Label>
                  <p className="text-sm text-gray-500">
                    Receive notifications on your device
                  </p>
                </div>
              </div>
              <Switch
                id="push-notifications"
                checked={enablePush}
                onCheckedChange={handlePushToggle}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <Label htmlFor="email-notifications" className="font-medium">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-gray-500">
                    Receive daily email digests of missed messages
                  </p>
                </div>
              </div>
              <Switch
                id="email-notifications"
                checked={enableEmail}
                onCheckedChange={handleEmailToggle}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Volume2 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <Label htmlFor="sound-notifications" className="font-medium">
                    Sound Notifications
                  </Label>
                  <p className="text-sm text-gray-500">
                    Play a sound when new messages arrive
                  </p>
                </div>
              </div>
              <Switch
                id="sound-notifications"
                checked={enableSound}
                onCheckedChange={handleSoundToggle}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Channel-Specific Settings</CardTitle>
            <CardDescription>
              Configure notification preferences for each connected channel
            </CardDescription>
          </CardHeader>
          <CardContent>
            {connectedChannels.length > 0 ? (
              <div className="space-y-4">
                {connectedChannels.map(channel => {
                  const isMuted = mutedChannels.includes(channel.id);
                  
                  return (
                    <div 
                      key={channel.id}
                      className="flex items-center justify-between p-3 rounded-md border hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={channel.avatar} alt={channel.name} />
                          <AvatarFallback>{channel.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{channel.name}</div>
                          <div className="text-xs text-gray-500">{channel.type}</div>
                        </div>
                      </div>
                      
                      <Button
                        variant={isMuted ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleChannelMute(channel.id)}
                      >
                        {isMuted ? (
                          <>
                            <BellRing className="h-4 w-4 mr-2" />
                            Unmute
                          </>
                        ) : (
                          <>
                            <BellOff className="h-4 w-4 mr-2" />
                            Mute
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <BellOff className="h-12 w-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-medium">No Channels Connected</h3>
                <p className="text-sm text-gray-500 mt-1 mb-4">
                  Connect channels to manage their notification settings
                </p>
                <Button asChild>
                  <a href="/add-channel">Add a Channel</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsPage;
