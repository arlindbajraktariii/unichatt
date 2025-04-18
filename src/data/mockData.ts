
import { ChannelConnection, Message, NotificationSettings, UserProfile } from "../types";

// Mock user data
export const mockUser: UserProfile = {
  id: "user-1",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  avatar_url: "https://i.pravatar.cc/150?img=11",
  created_at: "2023-01-15T09:24:42Z"
};

// Mock channel connections
export const mockChannelConnections: ChannelConnection[] = [
  {
    id: "conn-1",
    user_id: "user-1",
    type: "slack",
    name: "Work Slack",
    is_connected: true,
    avatar: "/logos/slack.svg",
    created_at: "2023-01-16T10:30:00Z",
    last_sync: "2023-06-12T08:45:22Z"
  },
  {
    id: "conn-2",
    user_id: "user-1",
    type: "discord",
    name: "Gaming Server",
    is_connected: true,
    avatar: "/logos/discord.svg",
    created_at: "2023-02-01T14:22:10Z",
    last_sync: "2023-06-12T09:15:44Z"
  },
  {
    id: "conn-3",
    user_id: "user-1",
    type: "teams",
    name: "Microsoft Teams",
    is_connected: false,
    avatar: "/logos/teams.svg",
    created_at: "2023-02-10T11:05:33Z"
  },
  {
    id: "conn-4",
    user_id: "user-1",
    type: "gmail",
    name: "Personal Email",
    is_connected: true,
    avatar: "/logos/gmail.svg",
    created_at: "2023-01-18T08:40:21Z",
    last_sync: "2023-06-12T08:30:15Z"
  },
  {
    id: "conn-5",
    user_id: "user-1",
    type: "twitter",
    name: "Twitter",
    is_connected: false,
    avatar: "/logos/twitter.svg",
    created_at: "2023-03-05T16:12:45Z"
  },
  {
    id: "conn-6",
    user_id: "user-1",
    type: "linkedin",
    name: "LinkedIn",
    is_connected: false,
    avatar: "/logos/linkedin.svg",
    created_at: "2023-03-22T13:50:18Z"
  }
];

// Mock messages
export const mockMessages: Message[] = [
  {
    id: "msg-1",
    channel_id: "conn-1",
    channelType: "slack",
    sender_id: "sender-1",
    sender_name: "Sarah Miller",
    sender_avatar: "https://i.pravatar.cc/150?img=5",
    content: "Hey team, I've finished the design mockups for the new feature. Could you provide feedback by EOD?",
    created_at: "2023-06-12T08:30:15Z",
    status: "unread",
    is_starred: true,
  },
  {
    id: "msg-2",
    channel_id: "conn-1",
    channelType: "slack",
    sender_id: "sender-2",
    sender_name: "Mike Chen",
    sender_avatar: "https://i.pravatar.cc/150?img=12",
    content: "I'll be working from home today. Available on Slack and email if anyone needs me.",
    created_at: "2023-06-12T07:45:22Z",
    status: "read",
    is_starred: false,
  },
  {
    id: "msg-3",
    channel_id: "conn-2",
    channelType: "discord",
    sender_id: "sender-3",
    sender_name: "GameMaster",
    sender_avatar: "https://i.pravatar.cc/150?img=8",
    content: "Server maintenance scheduled for tonight at 10 PM EST. Expect 30 minutes of downtime.",
    created_at: "2023-06-12T09:15:44Z",
    status: "unread",
    is_starred: false,
  },
  {
    id: "msg-4",
    channel_id: "conn-4",
    channelType: "gmail",
    sender_id: "sender-4",
    sender_name: "Amazon",
    sender_avatar: "https://i.pravatar.cc/150?img=50",
    content: "Your order #38291 has shipped and will arrive on Wednesday. Track your package here.",
    created_at: "2023-06-11T14:22:31Z",
    status: "read",
    is_starred: true,
  },
  {
    id: "msg-5",
    channel_id: "conn-4",
    channelType: "gmail",
    sender_id: "sender-5",
    sender_name: "LinkedIn",
    sender_avatar: "https://i.pravatar.cc/150?img=31",
    content: "You have 3 new connection requests and 5 new job recommendations based on your profile.",
    created_at: "2023-06-11T10:08:55Z",
    status: "read",
    is_starred: false,
  },
  {
    id: "msg-6",
    channel_id: "conn-1",
    channelType: "slack",
    sender_id: "sender-6",
    sender_name: "Project Bot",
    sender_avatar: "https://i.pravatar.cc/150?img=45",
    content: "Reminder: Weekly status meeting today at 2 PM in the main conference room.",
    created_at: "2023-06-12T06:00:00Z",
    status: "read",
    is_starred: false,
  },
  {
    id: "msg-7",
    channel_id: "conn-2",
    channelType: "discord",
    sender_id: "sender-7",
    sender_name: "EventCoordinator",
    sender_avatar: "https://i.pravatar.cc/150?img=22",
    content: "The guild tournament starts this weekend! Sign up by Friday to participate and win exclusive rewards.",
    created_at: "2023-06-11T17:45:10Z",
    status: "unread",
    is_starred: true,
  },
  {
    id: "msg-8",
    channel_id: "conn-1",
    channelType: "slack",
    sender_id: "sender-8",
    sender_name: "Alex Johnson",
    sender_avatar: "https://i.pravatar.cc/150?img=11",
    content: "I'll be out of office on Friday. Please contact Jamie for any urgent matters.",
    created_at: "2023-06-11T11:33:20Z",
    status: "read",
    is_starred: false,
    thread_id: "thread-1",
  },
  {
    id: "msg-9",
    channel_id: "conn-1",
    channelType: "slack",
    sender_id: "sender-9",
    sender_name: "Jamie Lee",
    sender_avatar: "https://i.pravatar.cc/150?img=20",
    content: "Got it. I'll handle any requests that come in. Enjoy your day off!",
    created_at: "2023-06-11T11:45:18Z",
    status: "read",
    is_starred: false,
    thread_id: "thread-1",
    parent_id: "msg-8",
  },
  {
    id: "msg-10",
    channel_id: "conn-1",
    channelType: "slack",
    sender_id: "sender-8",
    sender_name: "Alex Johnson",
    sender_avatar: "https://i.pravatar.cc/150?img=11",
    content: "Thanks Jamie, I appreciate it!",
    created_at: "2023-06-11T12:01:45Z",
    status: "read",
    is_starred: false,
    thread_id: "thread-1",
    parent_id: "msg-9",
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
