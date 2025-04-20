
import { useApp } from "@/context/AppContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { ChannelType } from "@/types";
import { useSlackConnect } from "@/hooks/useSlackConnect";
import { useDiscordConnect } from "@/hooks/useDiscordConnect";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const channelOptions = [
  { value: "slack", label: "Slack" },
  { value: "discord", label: "Discord" },
  { value: "teams", label: "Microsoft Teams (Coming Soon)" },
  { value: "gmail", label: "Gmail (Coming Soon)" },
  { value: "twitter", label: "Twitter (Coming Soon)" },
  { value: "linkedin", label: "LinkedIn (Coming Soon)" },
];

interface ChannelConnectProps {
  onBack?: () => void;
}

const ChannelConnect = ({ onBack }: ChannelConnectProps) => {
  const { connectChannel } = useApp();
  const { connect: connectSlack, isConnecting: isConnectingSlack } = useSlackConnect();
  const { connect: connectDiscord, isConnecting: isConnectingDiscord } = useDiscordConnect();
  
  const [channelType, setChannelType] = useState<ChannelType | "">("");
  const [channelName, setChannelName] = useState("");
  const [error, setError] = useState("");
  
  const handleConnect = async () => {
    setError("");
    
    if (!channelType) {
      setError("Please select a channel type");
      return;
    }
    
    if (channelType === "slack") {
      await connectSlack();
      return;
    }

    if (channelType === "discord") {
      try {
        await connectDiscord();
      } catch (err) {
        console.error("Discord connection error in handleConnect:", err);
        setError(err.message || "Failed to connect to Discord. Please try again.");
      }
      return;
    }
    
    if (!channelName) {
      setError("Please enter a name for this connection");
      return;
    }
    
    setTimeout(() => {
      connectChannel(channelType as ChannelType, channelName);
      
      setChannelType("");
      setChannelName("");
      
      if (onBack) {
        onBack();
      }
    }, 1500);
  };

  const isConnecting = isConnectingSlack || isConnectingDiscord;
  const showNameField = channelType !== "" && channelType !== "slack" && channelType !== "discord";

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
            onValueChange={(value: ChannelType | "") => {
              setChannelType(value);
              // Reset error when changing type
              setError("");
            }}
          >
            <SelectTrigger id="channel-type">
              <SelectValue placeholder="Select a channel type" />
            </SelectTrigger>
            <SelectContent>
              {channelOptions.map((option) => (
                <SelectItem key={option.value} value={option.value as ChannelType}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {showNameField && (
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
        )}
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {(channelType === "slack" || channelType === "discord") && (
          <Alert className="bg-amber-50 text-amber-800 border-amber-200">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>OAuth Authentication</AlertTitle>
            <AlertDescription>
              {channelType === "slack" ? "Slack" : "Discord"} requires OAuth authentication. 
              Clicking connect will open a new window where you can authorize this application.
              Make sure your browser doesn't block the popup window.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="pt-2">
          <p className="text-sm text-gray-500 mb-4">
            <strong>Note:</strong> In this demo, some connections are simulated. Discord and Slack use real OAuth authentication.
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
        
        <Button 
          onClick={handleConnect} 
          disabled={isConnecting} 
          className="bg-amber-400 hover:bg-amber-500 text-black"
        >
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
