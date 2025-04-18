
// Types for the multi-channel communication platform

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
};

export type ChannelType = 
  | "slack" 
  | "discord" 
  | "teams" 
  | "gmail" 
  | "twitter" 
  | "linkedin";

export type ChannelConnection = {
  id: string;
  user_id: string;
  type: ChannelType;
  name: string;
  access_token?: string;
  refresh_token?: string;
  metadata?: Record<string, any>;
  is_connected: boolean;
  last_sync?: string;
  created_at: string;
  // For UI display only, not in database
  avatar?: string;
};

export type MessageStatus = "unread" | "read" | "archived" | "replied";

export type Message = {
  id: string;
  channel_id: string;
  sender_id?: string;
  sender_name: string;
  sender_avatar?: string;
  content: string;
  attachments?: Attachment[];
  status: MessageStatus;
  is_starred: boolean;
  thread_id?: string;
  parent_id?: string;
  created_at: string;
  // For UI display only, not in database
  channelType?: ChannelType;
};

export type Attachment = {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
};

export type NotificationSettings = {
  userId: string;
  enablePush: boolean;
  enableEmail: boolean;
  enableSound: boolean;
  mutedChannels: string[];
};

export type TicketStatus = 'open' | 'in_progress' | 'resolved';
export type TicketPriority = 'low' | 'medium' | 'high';

export type Ticket = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
};
