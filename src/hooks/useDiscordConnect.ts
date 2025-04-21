
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';

export const useDiscordConnect = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { connectChannel } = useApp();
  const { toast } = useToast();

  const connect = async () => {
    setIsConnecting(true);
    try {
      // Get the auth URL from our edge function with proper auth headers
      const { data: authData } = await supabase.auth.getSession();
      const authToken = authData?.session?.access_token;
      
      const { data, error } = await supabase.functions.invoke('discord-auth', {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined
      });
      
      if (error) {
        console.error('Error invoking Discord auth function:', error);
        throw new Error(error.message || 'Failed to start Discord authentication');
      }
      
      if (!data || !data.url) {
        throw new Error('No authentication URL returned from server');
      }
      
      // Open the Discord OAuth window
      const authWindow = window.open(data.url, '_blank', 'width=800,height=600');
      
      if (!authWindow) {
        throw new Error('Could not open authentication window. Please check your popup blocker settings.');
      }
      
      // Listen for the OAuth callback
      const messageHandler = async (event: MessageEvent) => {
        if (event.data?.type === 'DISCORD_OAUTH_CALLBACK') {
          // Clean up the event listener
          window.removeEventListener('message', messageHandler);
          
          const { access_token, user_name } = event.data;
          
          if (!access_token) {
            throw new Error('No access token received from Discord');
          }
          
          // Connect the channel using the context function
          await connectChannel('discord', user_name || 'Discord Server', {
            access_token,
            user_name,
          });
          
          toast({
            title: 'Success!',
            description: `Connected to Discord as ${user_name || 'User'}`,
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
            description: 'The connection to Discord timed out. Please try again.',
            variant: 'destructive',
          });
        }
      }, 120000);
      
    } catch (error) {
      console.error('Discord connection error:', error);
      toast({
        title: 'Connection Failed',
        description: error.message || 'Could not connect to Discord. Please try again.',
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
