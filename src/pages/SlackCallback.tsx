
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const SlackCallback = () => {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const code = searchParams.get('code');
    
    const completeAuth = async () => {
      if (code) {
        try {
          const { data, error } = await supabase.functions.invoke('slack-auth', {
            body: { code }
          });
          
          if (error) throw error;
          
          // Send the data back to the opener window
          if (window.opener) {
            window.opener.postMessage({
              type: 'SLACK_OAUTH_CALLBACK',
              ...data
            }, '*');
          }
          
        } catch (error) {
          console.error('Error completing Slack auth:', error);
        }
      }
    };
    
    completeAuth();
  }, [searchParams]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Connecting to Slack...</h1>
        <p className="text-muted-foreground">
          You can close this window after the connection is complete.
        </p>
      </div>
    </div>
  );
};

export default SlackCallback;
