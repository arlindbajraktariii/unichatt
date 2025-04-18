
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  
  const handleSaveChanges = () => {
    toast({
      title: "Settings Saved",
      description: "Your preference changes have been saved successfully."
    });
  };

  return (
    <div className="container max-w-5xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and application preferences
          </p>
        </div>
      </div>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-medium">Account</h2>
          <p className="text-sm text-muted-foreground">
            Update your account information and password
          </p>
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="display-name">Display Name</Label>
              <input
                id="display-name"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                placeholder="Your display name"
                defaultValue="Alex Johnson"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="email">Email Address</Label>
              <input
                id="email"
                type="email"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                placeholder="Your email address"
                defaultValue="alex.johnson@example.com"
              />
            </div>
            
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-medium">Appearance</h2>
          <p className="text-sm text-muted-foreground">
            Customize how Channel Nexus looks on your device
          </p>
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="theme">Dark Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Use dark theme for the application
                </p>
              </div>
              <Switch id="theme" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="compact">Compact Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Show more content with less spacing
                </p>
              </div>
              <Switch id="compact" />
            </div>
            
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-medium">Session</h2>
          <p className="text-sm text-muted-foreground">
            Manage your login sessions and security settings
          </p>
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="2fa">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch id="2fa" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sessions">Active Sessions</Label>
                <p className="text-sm text-muted-foreground">
                  Manage all devices where you're currently logged in
                </p>
              </div>
              <Button variant="outline">Manage</Button>
            </div>
            
            <Button variant="destructive">Sign Out From All Devices</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
