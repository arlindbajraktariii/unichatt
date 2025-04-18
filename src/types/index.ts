
// Types for the multi-channel communication platform

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
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
  userId: string;
  type: ChannelType;
  name: string;
  isConnected: boolean;
  avatar?: string;
  createdAt: string;
  lastSync?: string;
};

export type MessageStatus = "unread" | "read" | "replied" | "archived";

export type Message = {
  id: string;
  channelId: string;
  channelType: ChannelType;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  attachments?: Attachment[];
  timestamp: string;
  status: MessageStatus;
  isStarred: boolean;
  threadId?: string;
  parentId?: string;
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
