
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
    let authWindow: Window | null = null;
    
    try {
      // Get the auth URL from our edge function
      const { data, error } = await supabase.functions.invoke('discord-auth');
      
      if (error) {
        console.error('Error invoking Discord auth function:', error);
        throw new Error(error.message || 'Failed to start Discord authentication');
      }
      
      if (!data || !data.url) {
        throw new Error('No authentication URL returned from server');
      }

      console.log('Opening Discord auth window with URL:', data.url);
      
      // Open the Discord OAuth window
      authWindow = window.open(data.url, '_blank', 'width=800,height=600');
      
      if (!authWindow) {
        throw new Error('Could not open authentication window. Please check your popup blocker settings.');
      }
      
      // Listen for the OAuth callback
      const messageHandler = async (event: MessageEvent) => {
        console.log('Received message from popup:', event.data);
        
        // Check that the message is the one we're expecting
        if (event.data?.type === 'DISCORD_OAUTH_CALLBACK') {
          try {
            // Clean up the event listener
            window.removeEventListener('message', messageHandler);
            setIsConnecting(false);
            
            const { access_token, user_name, user_id } = event.data;
            
            if (!access_token) {
              throw new Error('No access token received from Discord');
            }
            
            console.log('Discord connection successful:', { user_id, user_name });
            
            // Connect the channel using the context function
            await connectChannel('discord', user_name || 'Discord Server', {
              access_token,
              user_id,
              user_name,
            });
            
            toast({
              title: 'Success!',
              description: `Connected to Discord as ${user_name}`,
            });
            
            if (authWindow && !authWindow.closed) {
              authWindow.close();
            }
          } catch (innerError) {
            console.error('Error processing Discord callback:', innerError);
            toast({
              title: 'Connection Error',
              description: innerError.message || 'Failed to process Discord authentication.',
              variant: 'destructive',
            });
          }
        } else if (event.data?.type === 'DISCORD_OAUTH_ERROR') {
          // Handle error messages from the popup
          window.removeEventListener('message', messageHandler);
          setIsConnecting(false);
          
          console.error('Discord OAuth error:', event.data.error);
          toast({
            title: 'Discord Connection Failed',
            description: event.data.error || 'Authentication with Discord failed. Please try again.',
            variant: 'destructive',
          });
          
          if (authWindow && !authWindow.closed) {
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
          
          if (authWindow && !authWindow.closed) {
            authWindow.close();
          }
        }
      }, 120000);
      
    } catch (error) {
      console.error('Discord connection error:', error);
      setIsConnecting(false);
      
      toast({
        title: 'Connection Failed',
        description: error.message || 'Could not connect to Discord. Please try again.',
        variant: 'destructive',
      });
      
      if (authWindow && !authWindow.closed) {
        authWindow.close();
      }
    }
  };

  return {
    connect,
    isConnecting,
  };
};
