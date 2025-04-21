
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
      // Get the auth URL from our edge function with proper auth headers
      const { data: authData } = await supabase.auth.getSession();
      
      if (!authData?.session?.access_token) {
        throw new Error('You must be logged in to connect Slack');
      }
      
      const { data, error } = await supabase.functions.invoke('slack-auth', {
        headers: {
          Authorization: `Bearer ${authData.session.access_token}`
        }
      });
      
      if (error) {
        console.error('Error invoking Slack auth function:', error);
        throw new Error(error.message || 'Failed to start Slack authentication');
      }
      
      if (!data || !data.url) {
        throw new Error('No authentication URL returned from server');
      }
      
      // Open the Slack OAuth window
      const authWindow = window.open(data.url, '_blank', 'width=800,height=600');
      
      if (!authWindow) {
        throw new Error('Could not open authentication window. Please check your popup blocker settings.');
      }
      
      // Listen for the OAuth callback
      const messageHandler = async (event: MessageEvent) => {
        if (event.data?.type === 'SLACK_OAUTH_CALLBACK') {
          // Clean up the event listener
          window.removeEventListener('message', messageHandler);
          
          const { access_token, team_name, team_id } = event.data;
          
          if (!access_token) {
            throw new Error('No access token received from Slack');
          }
          
          // Connect the channel using the context function
          await connectChannel('slack', team_name || 'Slack Workspace', {
            access_token,
            team_id,
            team_name,
          });
          
          toast({
            title: 'Success!',
            description: `Connected to ${team_name || 'Slack Workspace'}`,
          });
          
          if (authWindow) {
            authWindow.close();
          }
        }
      };
      
      window.addEventListener('message', messageHandler);
      
      // Set a timeout to stop loading state if no response after 2 minutes
      setTimeout(() => {
        if (isConnecting) {
          setIsConnecting(false);
          window.removeEventListener('message', messageHandler);
          toast({
            title: 'Connection Timeout',
            description: 'The connection to Slack timed out. Please try again.',
            variant: 'destructive',
          });
        }
      }, 120000);
      
    } catch (error) {
      console.error('Slack connection error:', error);
      toast({
        title: 'Connection Failed',
        description: error.message || 'Could not connect to Slack. Please try again.',
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
