
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';

export const useSlackConnect = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { connectChannel } = useApp();
  const { toast } = useToast();

  const connect = async () => {
    setIsConnecting(true);
    try {
      // Get the auth URL from our edge function
      const { data, error } = await supabase.functions.invoke('slack-auth');
      
      if (error) throw error;
      
      // Open the Slack OAuth window
      const authWindow = window.open(data.url, '_blank', 'width=800,height=600');
      
      // Listen for the OAuth callback
      window.addEventListener('message', async (event) => {
        if (event.data.type === 'SLACK_OAUTH_CALLBACK') {
          const { access_token, team_name } = event.data;
          
          // Connect the channel using the context function
          // The error was here - we were passing 3 arguments but the function expects 2
          // Now we pass the channel type, name, and metadata as an object
          await connectChannel('slack', team_name, {
            access_token,
            team_name,
          });
          
          toast({
            title: 'Success!',
            description: `Connected to ${team_name}`,
          });
          
          if (authWindow) {
            authWindow.close();
          }
        }
      });
    } catch (error) {
      console.error('Slack connection error:', error);
      toast({
        title: 'Connection Failed',
        description: 'Could not connect to Slack. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return {
    connect,
    isConnecting,
  };
};
