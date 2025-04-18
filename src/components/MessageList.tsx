
import { useApp } from "@/context/AppContext";
import { Message } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow, parseISO } from "date-fns";
import { 
  Archive, 
  CornerDownRight, 
  MessageSquare, 
  MoreHorizontal,
  Star 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";

interface MessageListProps {
  messages: Message[];
  channelId?: string | null;
  filter?: string;
}

const MessageList = ({ messages, channelId, filter }: MessageListProps) => {
  const { 
    markMessageAsRead, 
    replyToMessage, 
    starMessage, 
    archiveMessage 
  } = useApp();
  
  const [replyText, setReplyText] = useState<string>("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [openThreads, setOpenThreads] = useState<Record<string, boolean>>({});

  // Filter messages
  let filteredMessages = messages;
  
  // Filter by channel if specified
  if (channelId) {
    filteredMessages = filteredMessages.filter(message => message.channelId === channelId);
  }
  
  // Filter by filter type if specified
  if (filter === "starred") {
    filteredMessages = filteredMessages.filter(message => message.isStarred);
  } else if (filter === "archived") {
    filteredMessages = filteredMessages.filter(message => message.status === "archived");
  } else if (filter === "unread") {
    filteredMessages = filteredMessages.filter(message => message.status === "unread");
  }
  
  // Group messages by thread
  const messageThreads: Record<string, Message[]> = {};
  const rootMessages: Message[] = [];
  
  filteredMessages.forEach(message => {
    if (message.threadId && message.parentId) {
      // This is a reply in a thread
      if (!messageThreads[message.threadId]) {
        messageThreads[message.threadId] = [];
      }
      messageThreads[message.threadId].push(message);
    } else if (message.threadId) {
      // This is the first message in a thread
      rootMessages.push(message);
    } else {
      // This is a standalone message
      rootMessages.push(message);
    }
  });
  
  // Sort messages by timestamp, newest first for top level messages
  rootMessages.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Handler for clicking on a message
  const handleMessageClick = (messageId: string) => {
    markMessageAsRead(messageId);
  };
  
  // Toggle thread open state
  const toggleThread = (threadId: string) => {
    setOpenThreads(prev => ({
      ...prev,
      [threadId]: !prev[threadId]
    }));
  };
  
  // Start replying to a message
  const handleReply = (messageId: string) => {
    setReplyingTo(messageId);
    setReplyText("");
  };
  
  // Send a reply
  const handleSendReply = (messageId: string) => {
    if (replyText.trim()) {
      replyToMessage(messageId, replyText);
      setReplyingTo(null);
      setReplyText("");
    }
  };
  
  // Toggle star on a message
  const handleToggleStar = (messageId: string, currentValue: boolean) => {
    starMessage(messageId, !currentValue);
  };
  
  // Archive a message
  const handleArchive = (messageId: string) => {
    archiveMessage(messageId);
  };
  
  // For each thread, sort replies by timestamp, oldest first
  Object.keys(messageThreads).forEach(threadId => {
    messageThreads[threadId].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  });

  if (filteredMessages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500">
        <MessageSquare className="h-16 w-16 mb-4 opacity-20" />
        <h3 className="text-lg font-medium">No messages</h3>
        <p className="text-sm max-w-md mt-2">
          {filter === "starred" 
            ? "You haven't starred any messages yet."
            : filter === "archived"
            ? "Your archive is empty."
            : filter === "unread"
            ? "You've read all your messages!"
            : channelId
            ? "This channel doesn't have any messages yet."
            : "Connect a channel to start receiving messages."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3 p-4">
      {rootMessages.map((message) => (
        <div 
          key={message.id} 
          className={`rounded-lg border p-4 transition-colors ${
            message.status === "unread" ? "bg-blue-50 border-blue-100" : "bg-white"
          }`}
          onClick={() => handleMessageClick(message.id)}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{message.senderName}</div>
                <div className="text-xs text-gray-500">
                  {formatDistanceToNow(parseISO(message.timestamp), { addSuffix: true })}
                </div>
              </div>
              
              <Badge variant="outline" className="ml-2">
                {message.channelType}
              </Badge>
              
              {message.status === "unread" && (
                <Badge className="ml-1 bg-blue-500">New</Badge>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleStar(message.id, message.isStarred);
                }}
                size="icon"
                variant="ghost"
                className="h-8 w-8"
              >
                <Star 
                  className={`h-4 w-4 ${message.isStarred ? "fill-yellow-400 text-yellow-400" : ""}`} 
                />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReply(message.id);
                    }}
                  >
                    <CornerDownRight className="mr-2 h-4 w-4" />
                    Reply
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStar(message.id, message.isStarred);
                    }}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    {message.isStarred ? "Unstar" : "Star"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleArchive(message.id);
                    }}
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="mt-2 text-sm">{message.content}</div>
          
          {/* Reply UI */}
          {replyingTo === message.id && (
            <div className="mt-4 bg-gray-50 p-3 rounded-md">
              <Textarea
                placeholder="Type your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-[80px] text-sm"
              />
              <div className="flex justify-end mt-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setReplyingTo(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSendReply(message.id);
                  }}
                >
                  Send Reply
                </Button>
              </div>
            </div>
          )}
          
          {/* Thread UI */}
          {message.threadId && messageThreads[message.threadId] && messageThreads[message.threadId].length > 0 && (
            <Collapsible 
              open={openThreads[message.threadId] || false}
              onOpenChange={() => toggleThread(message.threadId!)}
              className="mt-3"
            >
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs flex items-center gap-1 text-gray-500"
                  onClick={(e) => e.stopPropagation()}
                >
                  {openThreads[message.threadId!] ? "Hide" : "Show"} {messageThreads[message.threadId!].length} {messageThreads[message.threadId!].length === 1 ? "reply" : "replies"}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 border-l-2 border-gray-200 pl-4 space-y-3">
                {messageThreads[message.threadId!].map((reply) => (
                  <div key={reply.id} className="text-sm bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={reply.senderAvatar} alt={reply.senderName} />
                        <AvatarFallback>{reply.senderName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium text-xs">{reply.senderName}</div>
                      <div className="text-xs text-gray-500">
                        {formatDistanceToNow(parseISO(reply.timestamp), { addSuffix: true })}
                      </div>
                    </div>
                    <div>{reply.content}</div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
          
          {(!message.threadId || !messageThreads[message.threadId]) && (
            <div className="mt-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs flex items-center gap-1 text-gray-500"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReply(message.id);
                }}
              >
                <CornerDownRight className="h-3 w-3 mr-1" />
                Reply
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
