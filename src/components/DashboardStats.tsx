import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChannelType } from "@/types";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { Inbox, MessageSquare, BellDot, Archive } from "lucide-react";

// Mock data for the charts
const activityData = [{
  name: "Mon",
  messages: 12
}, {
  name: "Tue",
  messages: 19
}, {
  name: "Wed",
  messages: 15
}, {
  name: "Thu",
  messages: 27
}, {
  name: "Fri",
  messages: 22
}, {
  name: "Sat",
  messages: 8
}, {
  name: "Sun",
  messages: 5
}];
const DashboardStats = () => {
  const {
    messages,
    channels
  } = useApp();

  // Calculate stats
  const totalMessages = messages.length;
  const unreadMessages = messages.filter(msg => msg.status === "unread").length;
  const starredMessages = messages.filter(msg => msg.is_starred).length;
  const archivedMessages = messages.filter(msg => msg.status === "archived").length;

  // Count messages by channel type
  const messagesByChannelType: Record<string, number> = {};
  messages.forEach(message => {
    const channel = channels.find(c => c.id === message.channel_id);
    if (channel) {
      if (!messagesByChannelType[channel.type]) {
        messagesByChannelType[channel.type] = 0;
      }
      messagesByChannelType[channel.type]++;
    }
  });

  // Prepare data for the channel distribution chart
  const channelDistributionData = Object.entries(messagesByChannelType).map(([type, count]) => ({
    name: type,
    value: count
  }));

  // Colors for the bar chart
  const COLORS = ["#6366F1",
  // indigo
  "#8B5CF6",
  // violet
  "#EC4899",
  // pink
  "#10B981",
  // emerald
  "#F59E0B",
  // amber
  "#EF4444" // red
  ];
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gray-100">
          <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
          <Inbox className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent className="bg-gray-100">
          <div className="text-2xl font-bold">{totalMessages}</div>
          <p className="text-xs text-muted-foreground mt-1">
            From {channels.filter(c => c.is_connected).length} connected channels
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gray-100">
          <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
          <BellDot className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent className="bg-gray-100">
          <div className="text-2xl font-bold">{unreadMessages}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {unreadMessages === 0 ? "You're all caught up!" : `${Math.round(unreadMessages / totalMessages * 100)}% of your inbox`}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gray-100">
          <CardTitle className="text-sm font-medium">Starred Messages</CardTitle>
          <MessageSquare className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent className="bg-gray-100">
          <div className="text-2xl font-bold">{starredMessages}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Important messages you've saved
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gray-100">
          <CardTitle className="text-sm font-medium">Archived Messages</CardTitle>
          <Archive className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent className="bg-gray-100">
          <div className="text-2xl font-bold">{archivedMessages}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Messages you've processed
          </p>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 md:col-span-2">
        <CardHeader className="bg-gray-100">
          <CardTitle>Message Activity</CardTitle>
          <CardDescription>Messages received per day</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px] bg-gray-100">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityData} margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 5
          }}>
              <XAxis dataKey="name" tick={{
              fontSize: 12
            }} tickLine={false} axisLine={false} />
              <YAxis tick={{
              fontSize: 12
            }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="messages" stroke="#6366F1" strokeWidth={2} dot={{
              r: 4,
              strokeWidth: 2
            }} activeDot={{
              r: 6,
              strokeWidth: 2
            }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 md:col-span-2 bg-gray-100">
        <CardHeader>
          <CardTitle>Channel Distribution</CardTitle>
          <CardDescription>Messages by platform</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={channelDistributionData} margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 5
          }}>
              <XAxis dataKey="name" tick={{
              fontSize: 12
            }} tickLine={false} axisLine={false} />
              <YAxis tick={{
              fontSize: 12
            }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="value" barSize={30}>
                {channelDistributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>;
};
export default DashboardStats;