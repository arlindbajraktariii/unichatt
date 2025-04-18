
import { ChannelConnection, Message, NotificationSettings, UserProfile } from "../types";

// Mock user data
export const mockUser: UserProfile = {
  id: "user-1",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  avatar: "https://i.pravatar.cc/150?img=11",
  createdAt: "2023-01-15T09:24:42Z"
};

// Mock channel connections
export const mockChannelConnections: ChannelConnection[] = [
  {
    id: "conn-1",
    userId: "user-1",
    type: "slack",
    name: "Work Slack",
    isConnected: true,
    avatar: "/logos/slack.svg",
    createdAt: "2023-01-16T10:30:00Z",
    lastSync: "2023-06-12T08:45:22Z"
  },
  {
    id: "conn-2",
    userId: "user-1",
    type: "discord",
    name: "Gaming Server",
    isConnected: true,
    avatar: "/logos/discord.svg",
    createdAt: "2023-02-01T14:22:10Z",
    lastSync: "2023-06-12T09:15:44Z"
  },
  {
    id: "conn-3",
    userId: "user-1",
    type: "teams",
    name: "Microsoft Teams",
    isConnected: false,
    avatar: "/logos/teams.svg",
    createdAt: "2023-02-10T11:05:33Z"
  },
  {
    id: "conn-4",
    userId: "user-1",
    type: "gmail",
    name: "Personal Email",
    isConnected: true,
    avatar: "/logos/gmail.svg",
    createdAt: "2023-01-18T08:40:21Z",
    lastSync: "2023-06-12T08:30:15Z"
  },
  {
    id: "conn-5",
    userId: "user-1",
    type: "twitter",
    name: "Twitter",
    isConnected: false,
    avatar: "/logos/twitter.svg",
    createdAt: "2023-03-05T16:12:45Z"
  },
  {
    id: "conn-6",
    userId: "user-1",
    type: "linkedin",
    name: "LinkedIn",
    isConnected: false,
    avatar: "/logos/linkedin.svg",
    createdAt: "2023-03-22T13:50:18Z"
  }
];

// Mock messages
export const mockMessages: Message[] = [
  {
    id: "msg-1",
    channelId: "conn-1",
    channelType: "slack",
    senderId: "sender-1",
    senderName: "Sarah Miller",
    senderAvatar: "https://i.pravatar.cc/150?img=5",
    content: "Hey team, I've finished the design mockups for the new feature. Could you provide feedback by EOD?",
    timestamp: "2023-06-12T08:30:15Z",
    status: "unread",
    isStarred: true,
  },
  {
    id: "msg-2",
    channelId: "conn-1",
    channelType: "slack",
    senderId: "sender-2",
    senderName: "Mike Chen",
    senderAvatar: "https://i.pravatar.cc/150?img=12",
    content: "I'll be working from home today. Available on Slack and email if anyone needs me.",
    timestamp: "2023-06-12T07:45:22Z",
    status: "read",
    isStarred: false,
  },
  {
    id: "msg-3",
    channelId: "conn-2",
    channelType: "discord",
    senderId: "sender-3",
    senderName: "GameMaster",
    senderAvatar: "https://i.pravatar.cc/150?img=8",
    content: "Server maintenance scheduled for tonight at 10 PM EST. Expect 30 minutes of downtime.",
    timestamp: "2023-06-12T09:15:44Z",
    status: "unread",
    isStarred: false,
  },
  {
    id: "msg-4",
    channelId: "conn-4",
    channelType: "gmail",
    senderId: "sender-4",
    senderName: "Amazon",
    senderAvatar: "https://i.pravatar.cc/150?img=50",
    content: "Your order #38291 has shipped and will arrive on Wednesday. Track your package here.",
    timestamp: "2023-06-11T14:22:31Z",
    status: "read",
    isStarred: true,
  },
  {
    id: "msg-5",
    channelId: "conn-4",
    channelType: "gmail",
    senderId: "sender-5",
    senderName: "LinkedIn",
    senderAvatar: "https://i.pravatar.cc/150?img=31",
    content: "You have 3 new connection requests and 5 new job recommendations based on your profile.",
    timestamp: "2023-06-11T10:08:55Z",
    status: "read",
    isStarred: false,
  },
  {
    id: "msg-6",
    channelId: "conn-1",
    channelType: "slack",
    senderId: "sender-6",
    senderName: "Project Bot",
    senderAvatar: "https://i.pravatar.cc/150?img=45",
    content: "Reminder: Weekly status meeting today at 2 PM in the main conference room.",
    timestamp: "2023-06-12T06:00:00Z",
    status: "read",
    isStarred: false,
  },
  {
    id: "msg-7",
    channelId: "conn-2",
    channelType: "discord",
    senderId: "sender-7",
    senderName: "EventCoordinator",
    senderAvatar: "https://i.pravatar.cc/150?img=22",
    content: "The guild tournament starts this weekend! Sign up by Friday to participate and win exclusive rewards.",
    timestamp: "2023-06-11T17:45:10Z",
    status: "unread",
    isStarred: true,
  },
  {
    id: "msg-8",
    channelId: "conn-1",
    channelType: "slack",
    senderId: "sender-8",
    senderName: "Alex Johnson",
    senderAvatar: "https://i.pravatar.cc/150?img=11",
    content: "I'll be out of office on Friday. Please contact Jamie for any urgent matters.",
    timestamp: "2023-06-11T11:33:20Z",
    status: "read",
    isStarred: false,
    threadId: "thread-1",
  },
  {
    id: "msg-9",
    channelId: "conn-1",
    channelType: "slack",
    senderId: "sender-9",
    senderName: "Jamie Lee",
    senderAvatar: "https://i.pravatar.cc/150?img=20",
    content: "Got it. I'll handle any requests that come in. Enjoy your day off!",
    timestamp: "2023-06-11T11:45:18Z",
    status: "read",
    isStarred: false,
    threadId: "thread-1",
    parentId: "msg-8",
  },
  {
    id: "msg-10",
    channelId: "conn-1",
    channelType: "slack",
    senderId: "sender-8",
    senderName: "Alex Johnson",
    senderAvatar: "https://i.pravatar.cc/150?img=11",
    content: "Thanks Jamie, I appreciate it!",
    timestamp: "2023-06-11T12:01:45Z",
    status: "read",
    isStarred: false,
    threadId: "thread-1",
    parentId: "msg-9",
  }
];

// Mock notification settings
export const mockNotificationSettings: NotificationSettings = {
  userId: "user-1",
  enablePush: true,
  enableEmail: false,
  enableSound: true,
  mutedChannels: ["conn-3"]
};
