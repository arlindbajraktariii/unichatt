
import React, { createContext, useContext, useState, useEffect } from "react";
import { ChannelConnection, Message, NotificationSettings, UserProfile, MessageStatus, ChannelType } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AppContextProps {
  user: UserProfile | null;
  isLoading: boolean;
  channels: ChannelConnection[];
  messages: Message[];
  notificationSettings: NotificationSettings | null;
  currentChannel: string | null;
  setCurrentChannel: (channelId: string | null) => void;
  connectChannel: (channelType: ChannelType, name: string) => void;
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

  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch initial data from Supabase
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        try {
          // Fetch user profile
          const { data: userProfile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          // Fetch user channels
          const { data: userChannels, error: channelsError } = await supabase
            .from('channel_connections')
            .select('*')
            .eq('user_id', authUser.id);

          // Fetch recent messages
          const { data: recentMessages, error: messagesError } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

          if (profileError || channelsError || messagesError) {
            console.error('Error fetching initial data', { profileError, channelsError, messagesError });
            return;
          }

          setUser(userProfile);
          setChannels(userChannels || []);
          setMessages(recentMessages || []);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Error setting up initial data', err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Calculate unread count
  const unreadCount = messages.filter(message => message.status === "unread").length;

  // Connect a new channel
  const connectChannel = async (channelType: ChannelType, name: string) => {
    const { data, error } = await supabase
      .from('channel_connections')
      .insert({
        user_id: user?.id,
        type: channelType,
        name,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Channel Connection Failed",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    setChannels([...channels, data]);
    toast({
      title: "Channel Connected",
      description: `Successfully connected to ${name}`,
    });
  };

  // Disconnect a channel
  const disconnectChannel = async (channelId: string) => {
    const { error } = await supabase
      .from('channel_connections')
      .delete()
      .eq('id', channelId);

    if (error) {
      toast({
        title: "Channel Disconnection Failed",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    const updatedChannels = channels.filter(channel => channel.id !== channelId);
    setChannels(updatedChannels);
    
    toast({
      title: "Channel Disconnected",
      description: "Channel has been disconnected",
      variant: "destructive"
    });
  };

  // Mark message as read
  const markMessageAsRead = async (messageId: string) => {
    const { error } = await supabase
      .from('messages')
      .update({ status: 'read' })
      .eq('id', messageId);

    if (error) {
      toast({
        title: "Error",
        description: "Could not mark message as read",
        variant: "destructive"
      });
      return;
    }

    const updatedMessages = messages.map(message => 
      message.id === messageId ? { ...message, status: 'read' } : message
    );
    setMessages(updatedMessages);
  };

  // Reply to a message
  const replyToMessage = async (messageId: string, content: string) => {
    // Find original message
    const originalMessage = messages.find(m => m.id === messageId);
    if (!originalMessage) return;

    const { data, error } = await supabase
      .from('messages')
      .insert({
        channel_id: originalMessage.channel_id,
        sender_id: user?.id,
        sender_name: user?.name,
        sender_avatar: user?.avatar_url,
        content,
        status: 'read',
        parent_id: messageId,
        thread_id: originalMessage.thread_id || originalMessage.id
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Could not send reply",
        variant: "destructive"
      });
      return;
    }

    // Update original message status
    await supabase
      .from('messages')
      .update({ status: 'replied' })
      .eq('id', messageId);

    // Update local state
    const updatedMessages = [
      ...messages.map(message => 
        message.id === messageId ? { ...message, status: 'replied' } : message
      ),
      data
    ];
    setMessages(updatedMessages);

    toast({
      title: "Reply Sent",
      description: "Your message has been sent successfully."
    });
  };

  // Star or unstar a message
  const starMessage = async (messageId: string, isStarred: boolean) => {
    const { error } = await supabase
      .from('messages')
      .update({ is_starred: isStarred })
      .eq('id', messageId);

    if (error) {
      toast({
        title: "Error",
        description: "Could not update message star status",
        variant: "destructive"
      });
      return;
    }

    const updatedMessages = messages.map(message => 
      message.id === messageId ? { ...message, is_starred: isStarred } : message
    );
    setMessages(updatedMessages);
  };

  // Archive a message
  const archiveMessage = async (messageId: string) => {
    const { error } = await supabase
      .from('messages')
      .update({ status: 'archived' })
      .eq('id', messageId);

    if (error) {
      toast({
        title: "Error",
        description: "Could not archive message",
        variant: "destructive"
      });
      return;
    }

    const updatedMessages = messages.map(message => 
      message.id === messageId ? { ...message, status: 'archived' } : message
    );
    setMessages(updatedMessages);
    
    toast({
      title: "Message Archived",
      description: "The message has been moved to your archive."
    });
  };

  // Update notification settings
  const updateNotificationSettings = async (settings: Partial<NotificationSettings>) => {
    if (!notificationSettings) return;
    
    const updatedSettings = { ...notificationSettings, ...settings };
    setNotificationSettings(updatedSettings);
    
    toast({
      title: "Settings Updated",
      description: "Your notification preferences have been saved."
    });
  };

  // Login functionality
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive"
      });
      setIsLoading(false);
      return false;
    }

    // If successful, the user data is set in the initial data fetching useEffect
    setIsAuthenticated(true);
    setIsLoading(false);
    
    toast({
      title: "Welcome Back!",
      description: `You've successfully signed in.`
    });
    
    return true;
  };

  // Signup functionality
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });

    if (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive"
      });
      setIsLoading(false);
      return false;
    }

    setIsAuthenticated(true);
    setIsLoading(false);
    
    toast({
      title: "Account Created!",
      description: `Welcome to Channel Nexus, ${name}!`
    });
    
    return true;
  };

  // Logout functionality
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

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
