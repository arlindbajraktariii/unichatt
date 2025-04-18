
import { useApp } from "@/context/AppContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { ChannelType } from "@/types";

const channelOptions = [
  { value: "slack", label: "Slack" },
  { value: "discord", label: "Discord" },
  { value: "teams", label: "Microsoft Teams" },
  { value: "gmail", label: "Gmail" },
  { value: "twitter", label: "Twitter" },
  { value: "linkedin", label: "LinkedIn" },
];

interface ChannelConnectProps {
  onBack?: () => void;
}

const ChannelConnect = ({ onBack }: ChannelConnectProps) => {
  const { connectChannel } = useApp();
  
  const [channelType, setChannelType] = useState<ChannelType | "">("");
  const [channelName, setChannelName] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");
  
  const handleConnect = () => {
    setError("");
    
    if (!channelType) {
      setError("Please select a channel type");
      return;
    }
    
    if (!channelName) {
      setError("Please enter a name for this connection");
      return;
    }
    
    setIsConnecting(true);
    
    // Simulate API connection delay
    setTimeout(() => {
      connectChannel(channelType as ChannelType, channelName);
      
      // Reset form
      setChannelType("");
      setChannelName("");
      setIsConnecting(false);
      
      // Go back if provided
      if (onBack) {
        onBack();
      }
    }, 1500);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <CardTitle>Connect a New Channel</CardTitle>
            <CardDescription>
              Add a communication platform to your Nexus dashboard
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="channel-type">Channel Type</Label>
          <Select 
            value={channelType} 
            onValueChange={(value: ChannelType | "") => setChannelType(value)}
          >
            <SelectTrigger id="channel-type">
              <SelectValue placeholder="Select a channel type" />
            </SelectTrigger>
            <SelectContent>
              {channelOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="channel-name">Connection Name</Label>
          <Input
            id="channel-name"
            placeholder="e.g., Work Slack, Personal Gmail"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Give this connection a memorable name to identify it
          </p>
        </div>
        
        {error && (
          <div className="text-sm text-red-500 p-2 bg-red-50 rounded-md">
            {error}
          </div>
        )}
        
        <div className="pt-2">
          <p className="text-sm text-gray-500 mb-4">
            <strong>Note:</strong> In this demo, connections are simulated. In a production version, you would be redirected to authenticate with the selected service.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {onBack ? (
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
        ) : (
          <Link to="/">
            <Button variant="outline">
              Cancel
            </Button>
          </Link>
        )}
        
        <Button onClick={handleConnect} disabled={isConnecting} className="bg-amber-400 hover:bg-amber-500 text-black">
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            "Connect Channel"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChannelConnect;
