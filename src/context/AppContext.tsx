
import React, { createContext, useContext, useState, useEffect } from "react";
import { ChannelConnection, Message, NotificationSettings, UserProfile } from "../types";
import { mockChannelConnections, mockMessages, mockNotificationSettings, mockUser } from "../data/mockData";
import { useToast } from "@/hooks/use-toast";

interface AppContextProps {
  user: UserProfile | null;
  isLoading: boolean;
  channels: ChannelConnection[];
  messages: Message[];
  notificationSettings: NotificationSettings | null;
  currentChannel: string | null;
  setCurrentChannel: (channelId: string | null) => void;
  connectChannel: (channelType: string, name: string) => void;
  disconnectChannel: (channelId: string) => void;
  markMessageAsRead: (messageId: string) => void;
  replyToMessage: (messageId: string, content: string) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  starMessage: (messageId: string, isStarred: boolean) => void;
  archiveMessage: (messageId: string) => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  unreadCount: number;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [channels, setChannels] = useState<ChannelConnection[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [currentChannel, setCurrentChannel] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();

  // Initialize with mock data for demo
  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setUser(mockUser);
      setChannels(mockChannelConnections);
      setMessages(mockMessages);
      setNotificationSettings(mockNotificationSettings);
      setIsLoading(false);
      
      // For demo purposes, let's auto-authenticate
      setIsAuthenticated(true);
    }, 1500);
  }, []);

  // Calculate unread count
  const unreadCount = messages.filter(message => message.status === "unread").length;

  // Connect a new channel
  const connectChannel = (channelType: string, name: string) => {
    const newChannel: ChannelConnection = {
      id: `conn-${Date.now()}`,
      userId: user?.id || "user-1",
      type: channelType as any,
      name,
      isConnected: true,
      avatar: `/logos/${channelType}.svg`,
      createdAt: new Date().toISOString(),
      lastSync: new Date().toISOString()
    };

    setChannels([...channels, newChannel]);
    toast({
      title: "Channel Connected",
      description: `Successfully connected to ${name}`,
    });
  };

  // Disconnect a channel
  const disconnectChannel = (channelId: string) => {
    const updatedChannels = channels.map(channel => 
      channel.id === channelId ? { ...channel, isConnected: false } : channel
    );
    setChannels(updatedChannels);
    toast({
      title: "Channel Disconnected",
      description: "Channel has been disconnected",
      variant: "destructive"
    });
  };

  // Mark message as read
  const markMessageAsRead = (messageId: string) => {
    const updatedMessages = messages.map(message => 
      message.id === messageId ? { ...message, status: "read" } : message
    );
    setMessages(updatedMessages);
  };

  // Reply to a message
  const replyToMessage = (messageId: string, content: string) => {
    // Find original message
    const originalMessage = messages.find(m => m.id === messageId);
    if (!originalMessage) return;

    // Create a new message as a reply
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      channelId: originalMessage.channelId,
      channelType: originalMessage.channelType,
      senderId: user?.id || "user-1",
      senderName: user?.name || "Alex Johnson",
      senderAvatar: user?.avatar,
      content,
      timestamp: new Date().toISOString(),
      status: "read",
      isStarred: false,
      threadId: originalMessage.threadId || originalMessage.id,
      parentId: messageId
    };

    // Update original message status
    const updatedMessages = messages.map(message => 
      message.id === messageId ? { ...message, status: "replied" } : message
    );

    // Add the new reply
    setMessages([...updatedMessages, newMessage]);

    toast({
      title: "Reply Sent",
      description: "Your message has been sent successfully."
    });
  };

  // Update notification settings
  const updateNotificationSettings = (settings: Partial<NotificationSettings>) => {
    if (!notificationSettings) return;
    
    const updatedSettings = { ...notificationSettings, ...settings };
    setNotificationSettings(updatedSettings);
    
    toast({
      title: "Settings Updated",
      description: "Your notification preferences have been saved."
    });
  };

  // Star or unstar a message
  const starMessage = (messageId: string, isStarred: boolean) => {
    const updatedMessages = messages.map(message => 
      message.id === messageId ? { ...message, isStarred } : message
    );
    setMessages(updatedMessages);
  };

  // Archive a message
  const archiveMessage = (messageId: string) => {
    const updatedMessages = messages.map(message => 
      message.id === messageId ? { ...message, status: "archived" } : message
    );
    setMessages(updatedMessages);
    
    toast({
      title: "Message Archived",
      description: "The message has been moved to your archive."
    });
  };

  // Mock login functionality
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, we would validate credentials here
    if (email && password) {
      setIsAuthenticated(true);
      setUser(mockUser);
      setChannels(mockChannelConnections);
      setMessages(mockMessages);
      setNotificationSettings(mockNotificationSettings);
      setIsLoading(false);
      
      toast({
        title: "Welcome Back!",
        description: `You've successfully signed in as ${mockUser.name}.`
      });
      
      return true;
    } else {
      setIsLoading(false);
      
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive"
      });
      
      return false;
    }
  };

  // Mock signup functionality
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (name && email && password) {
      const newUser: UserProfile = {
        ...mockUser,
        name,
        email,
      };
      
      setIsAuthenticated(true);
      setUser(newUser);
      setChannels([]);
      setMessages([]);
      setNotificationSettings({
        userId: newUser.id,
        enablePush: true,
        enableEmail: true,
        enableSound: true,
        mutedChannels: []
      });
      setIsLoading(false);
      
      toast({
        title: "Account Created!",
        description: `Welcome to Channel Nexus, ${name}!`
      });
      
      return true;
    } else {
      setIsLoading(false);
      
      toast({
        title: "Registration Failed",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      
      return false;
    }
  };

  // Logout functionality
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setChannels([]);
    setMessages([]);
    setNotificationSettings(null);
    
    toast({
      title: "Logged Out",
      description: "You've been successfully logged out."
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoading,
        channels,
        messages,
        notificationSettings,
        currentChannel,
        setCurrentChannel,
        connectChannel,
        disconnectChannel,
        markMessageAsRead,
        replyToMessage,
        updateNotificationSettings,
        starMessage,
        archiveMessage,
        login,
        signup,
        logout,
        isAuthenticated,
        unreadCount
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextProps => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
