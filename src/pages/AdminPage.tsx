
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ChannelConnection, UserProfile } from "@/types";
import { Shield, User, Bell, Mail, Database, ArrowLeft, Loader2, Check, X, RefreshCw } from "lucide-react";

interface AdminStats {
  userCount: number;
  channelCount: number;
  messageCount: number;
}

const AdminPage = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [channels, setChannels] = useState<ChannelConnection[]>([]);
  const [stats, setStats] = useState<AdminStats>({ userCount: 0, channelCount: 0, messageCount: 0 });
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAdminStatus = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', user?.id)
          .single();
        
        if (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        } else {
          setIsAdmin(true);
          fetchAdminData();
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*');
      
      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Fetch channels
      const { data: channelsData, error: channelsError } = await supabase
        .from('channel_connections')
        .select('*');
      
      if (channelsError) throw channelsError;
      setChannels(channelsData || []);

      // Fetch stats
      const userCount = usersData?.length || 0;
      const channelCount = channelsData?.length || 0;

      // Get message count
      const { count: messageCount, error: messageError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true });
      
      if (messageError) throw messageError;

      setStats({
        userCount,
        channelCount,
        messageCount: messageCount || 0
      });
    } catch (err) {
      console.error("Error fetching admin data:", err);
      toast({
        title: "Error",
        description: "Failed to load admin data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addAdminUser = async () => {
    setIsAddingAdmin(true);
    setError("");

    try {
      // First, check if user exists
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', newAdminEmail)
        .single();
      
      if (userError) {
        setError(`User with email ${newAdminEmail} not found.`);
        return;
      }

      // Check if already an admin
      const { data: existingAdmin, error: checkError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userData.id)
        .single();
      
      if (!checkError && existingAdmin) {
        setError(`User ${newAdminEmail} is already an admin.`);
        return;
      }

      // Add as admin
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert({
          user_id: userData.id,
          added_by: user?.id
        });
      
      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: `${newAdminEmail} has been added as an admin.`,
      });
      setNewAdminEmail("");
    } catch (err) {
      console.error("Error adding admin:", err);
      setError("Failed to add admin. Please try again.");
    } finally {
      setIsAddingAdmin(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-amber-500" />
          <p className="text-lg">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Admin Access Required</h1>
        </div>
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to access the admin panel. Please contact an administrator.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" onClick={handleBack} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <User className="w-6 h-6 mr-2 text-amber-500" />
              <span className="text-3xl font-bold">{stats.userCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Connected Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Database className="w-6 h-6 mr-2 text-amber-500" />
              <span className="text-3xl font-bold">{stats.channelCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Mail className="w-6 h-6 mr-2 text-amber-500" />
              <span className="text-3xl font-bold">{stats.messageCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="admins">Admin Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage users of the platform</CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={fetchAdminData}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Channel Management</CardTitle>
                  <CardDescription>Overview of all connected channels</CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={fetchAdminData}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Connected</TableHead>
                      <TableHead>Last Synced</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {channels.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No channels found
                        </TableCell>
                      </TableRow>
                    ) : (
                      channels.map((channel) => (
                        <TableRow key={channel.id}>
                          <TableCell>{channel.name}</TableCell>
                          <TableCell>{channel.type}</TableCell>
                          <TableCell>
                            {channel.is_connected ? (
                              <span className="flex items-center">
                                <Check className="w-4 h-4 text-green-500 mr-1" /> 
                                Connected
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <X className="w-4 h-4 text-red-500 mr-1" /> 
                                Disconnected
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {channel.last_sync 
                              ? new Date(channel.last_sync).toLocaleString() 
                              : "Never synced"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="admins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Management</CardTitle>
              <CardDescription>Add new administrators to the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">User Email</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="email" 
                      placeholder="Enter email address" 
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                    />
                    <Button 
                      onClick={addAdminUser} 
                      disabled={isAddingAdmin || !newAdminEmail.includes('@')}
                    >
                      {isAddingAdmin ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Admin"
                      )}
                    </Button>
                  </div>
                </div>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
