
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/context/AppContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const { user } = useApp();
  const [loading, setLoading] = useState(false);
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    soundAlerts: true,
    desktopNotifications: false,
    marketingEmails: false
  });

  const [displaySettings, setDisplaySettings] = useState({
    darkTheme: false,
    compactMode: false,
    showReadMessages: true,
    highlightPriority: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30"
  });

  useEffect(() => {
    if (user?.id) {
      loadUserSettings();
    }
  }, [user]);

  const loadUserSettings = async () => {
    setLoading(true);
    try {
      // This would actually fetch from a user_settings table in a real app
      // For now, we'll simulate loading from localStorage for the demo
      const savedNotificationSettings = localStorage.getItem('notification_settings');
      const savedDisplaySettings = localStorage.getItem('display_settings');
      const savedSecuritySettings = localStorage.getItem('security_settings');

      if (savedNotificationSettings) {
        setNotificationSettings(JSON.parse(savedNotificationSettings));
      }

      if (savedDisplaySettings) {
        setDisplaySettings(JSON.parse(savedDisplaySettings));
        // Apply dark theme if it was saved
        if (JSON.parse(savedDisplaySettings).darkTheme) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }

      if (savedSecuritySettings) {
        setSecuritySettings(JSON.parse(savedSecuritySettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings(prev => {
      const updated = { ...prev, [key]: value };
      
      // Special handling for desktop notifications
      if (key === 'desktopNotifications' && value) {
        requestNotificationPermission();
      }
      
      // Special handling for sound alerts
      if (key === 'soundAlerts') {
        // Play a test sound when enabled
        if (value) {
          const audio = new Audio('/notification-sound.mp3');
          audio.volume = 0.5;
          audio.play().catch(e => console.error('Error playing sound:', e));
        }
      }
      
      // Save to localStorage for demo purposes
      localStorage.setItem('notification_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Notifications Not Supported",
        description: "This browser does not support desktop notifications",
        variant: "destructive"
      });
      return;
    }
    
    if (Notification.permission === "granted") {
      showTestNotification();
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        showTestNotification();
      }
    }
  };

  const showTestNotification = () => {
    const notification = new Notification("Notifications Enabled", {
      body: "You will now receive desktop notifications",
      icon: "/logo.svg"
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  };

  const handleDisplayChange = (key: string, value: boolean) => {
    setDisplaySettings(prev => {
      const updated = { ...prev, [key]: value };
      
      // Apply dark theme immediately
      if (key === 'darkTheme') {
        if (value) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      
      // Apply compact mode immediately
      if (key === 'compactMode') {
        if (value) {
          document.documentElement.classList.add('compact');
        } else {
          document.documentElement.classList.remove('compact');
        }
      }
      
      // Save to localStorage for demo purposes
      localStorage.setItem('display_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSecurityChange = (key: string, value: any) => {
    setSecuritySettings(prev => {
      const updated = { ...prev, [key]: value };
      // Save to localStorage for demo purposes
      localStorage.setItem('security_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const saveSettings = async (type: 'notification' | 'display' | 'security') => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save settings",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // In a real app, you would save these settings to the database
      // For now, we'll just display a success message since we're already saving to localStorage
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: `Your ${type} settings have been updated successfully.`
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "There was a problem saving your settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for a link to reset your password.",
      });
    } catch (error) {
      console.error('Error sending password reset:', error);
      toast({
        title: "Error",
        description: "There was a problem sending the password reset email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 font-colvetica">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and application preferences
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
      
        <TabsContent value="account" className="space-y-6">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-medium">Account Information</h2>
            <p className="text-sm text-muted-foreground">
              Update your basic account details
            </p>
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  placeholder="Your display name"
                  defaultValue={user?.name || ""}
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  To change your name, visit your profile page.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email address"
                  defaultValue={user?.email || ""}
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  Your email is used for notifications and authentication.
                </p>
              </div>
              
              <Button
                onClick={() => saveSettings('notification')}
                disabled={loading || !user}
                className="bg-[#09090b] hover:bg-[#09090b]/90 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-medium">Subscription</h2>
            <p className="text-sm text-muted-foreground">
              Manage your subscription plan and billing
            </p>
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div className="bg-[#09090b]/5 border border-[#09090b]/20 rounded-lg p-4">
                <p className="font-medium">You don't have an active subscription</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose a subscription plan to access premium features.
                </p>
                <Button
                  onClick={() => navigate('/dashboard/subscription')}
                  className="mt-3 bg-[#09090b] hover:bg-[#09090b]/90 text-white"
                >
                  View Plans
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-medium">Connected Accounts</h2>
            <p className="text-sm text-muted-foreground">
              Manage your connected social accounts
            </p>
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border rounded-lg p-4">
                <div className="flex items-center">
                  <img src="/logos/slack.svg" alt="Slack" className="w-6 h-6 mr-3" />
                  <div>
                    <p className="font-medium">Slack</p>
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  </div>
                </div>
                <Button variant="outline" onClick={handleAddChannel}>Connect</Button>
              </div>
              
              <div className="flex items-center justify-between border rounded-lg p-4">
                <div className="flex items-center">
                  <img src="/logos/discord.svg" alt="Discord" className="w-6 h-6 mr-3" />
                  <div>
                    <p className="font-medium">Discord</p>
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  </div>
                </div>
                <Button variant="outline" onClick={handleAddChannel}>Connect</Button>
              </div>
              
              <div className="flex items-center justify-between border rounded-lg p-4">
                <div className="flex items-center">
                  <img src="/logos/teams.svg" alt="Microsoft Teams" className="w-6 h-6 mr-3" />
                  <div>
                    <p className="font-medium">Microsoft Teams</p>
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  </div>
                </div>
                <Button variant="outline" onClick={handleAddChannel}>Connect</Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-medium">Notification Preferences</h2>
            <p className="text-sm text-muted-foreground">
              Control how and when you receive notifications
            </p>
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications on your device
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sound-alerts">Sound Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Play sound when receiving messages
                  </p>
                </div>
                <Switch
                  id="sound-alerts"
                  checked={notificationSettings.soundAlerts}
                  onCheckedChange={(checked) => handleNotificationChange('soundAlerts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Show notifications on your desktop
                  </p>
                </div>
                <Switch
                  id="desktop-notifications"
                  checked={notificationSettings.desktopNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('desktopNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing-emails">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about new features and offers
                  </p>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={notificationSettings.marketingEmails}
                  onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked)}
                />
              </div>
              
              <Button
                onClick={() => saveSettings('notification')}
                disabled={loading}
                className="bg-[#09090b] hover:bg-[#09090b]/90 text-white mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Notification Settings'
                )}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-6">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-medium">Display Preferences</h2>
            <p className="text-sm text-muted-foreground">
              Customize how Channel Nexus looks on your device
            </p>
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-theme">Dark Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Use dark theme for the application
                  </p>
                </div>
                <Switch
                  id="dark-theme"
                  checked={displaySettings.darkTheme}
                  onCheckedChange={(checked) => handleDisplayChange('darkTheme', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compact-mode">Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Show more content with less spacing
                  </p>
                </div>
                <Switch
                  id="compact-mode"
                  checked={displaySettings.compactMode}
                  onCheckedChange={(checked) => handleDisplayChange('compactMode', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-read-messages">Show Read Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Display messages that have been read
                  </p>
                </div>
                <Switch
                  id="show-read-messages"
                  checked={displaySettings.showReadMessages}
                  onCheckedChange={(checked) => handleDisplayChange('showReadMessages', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="highlight-priority">Highlight Priority Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Visually highlight high priority messages
                  </p>
                </div>
                <Switch
                  id="highlight-priority"
                  checked={displaySettings.highlightPriority}
                  onCheckedChange={(checked) => handleDisplayChange('highlightPriority', checked)}
                />
              </div>
              
              <Button
                onClick={() => saveSettings('display')}
                disabled={loading}
                className="bg-[#09090b] hover:bg-[#09090b]/90 text-white mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Display Settings'
                )}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-medium">Security Settings</h2>
            <p className="text-sm text-muted-foreground">
              Manage your account security and login settings
            </p>
            <Separator className="my-4" />
            
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-base font-medium">Password</h3>
                <p className="text-sm text-muted-foreground">
                  Reset your password via email link
                </p>
                <Button
                  variant="outline"
                  onClick={handlePasswordReset}
                  disabled={loading || !user?.email}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Password Reset Email'
                  )}
                </Button>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor-auth">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    id="two-factor-auth"
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSecurityChange('twoFactorAuth', checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    min="5"
                    max="120"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Automatically log out after inactivity period
                  </p>
                </div>
                
                <Button
                  onClick={() => saveSettings('security')}
                  disabled={loading}
                  className="bg-[#09090b] hover:bg-[#09090b]/90 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Security Settings'
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-destructive/20 shadow-sm p-6">
            <h2 className="text-lg font-medium text-destructive">Danger Zone</h2>
            <p className="text-sm text-muted-foreground">
              Actions that cannot be undone
            </p>
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-base font-medium text-red-800">Delete Account</h3>
                <p className="text-sm text-red-600 mt-1">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button
                  variant="destructive"
                  className="mt-3"
                  onClick={() => {
                    toast({
                      title: "Account Deletion",
                      description: "This feature is not yet implemented.",
                      variant: "destructive"
                    });
                  }}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function
const navigate = (path: string) => {
  window.location.href = path;
};

// Helper function for the channel connection
const handleAddChannel = () => {
  window.location.href = '/dashboard/add-channel';
};

export default Settings;
