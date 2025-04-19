
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const SlackCallback = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    
    // Handle error from Slack
    if (error) {
      console.error('Error returned from Slack:', error);
      setStatus('error');
      setErrorMessage(`Slack returned an error: ${error}`);
      return;
    }
    
    const completeAuth = async () => {
      if (code) {
        try {
          // Call our edge function with the code
          const { data, error } = await supabase.functions.invoke('slack-auth', {
            body: { code }
          });
          
          if (error) {
            throw new Error(`Edge function error: ${error.message}`);
          }
          
          if (!data || data.error) {
            throw new Error(data?.error || 'No data returned from Slack');
          }
          
          // Send the data back to the opener window
          if (window.opener) {
            window.opener.postMessage({
              type: 'SLACK_OAUTH_CALLBACK',
              ...data
            }, '*');
            setStatus('success');
          } else {
            throw new Error('Cannot communicate with parent window');
          }
          
        } catch (error) {
          console.error('Error completing Slack auth:', error);
          setStatus('error');
          setErrorMessage(error.message || 'Unknown error occurred');
        }
      } else {
        setStatus('error');
        setErrorMessage('No authorization code received from Slack');
      }
    };
    
    completeAuth();
  }, [searchParams]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">
          {status === 'loading' && 'Connecting to Slack...'}
          {status === 'success' && 'Connected to Slack!'}
          {status === 'error' && 'Connection Failed'}
        </h1>
        
        {status === 'loading' && (
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        )}
        
        {status === 'success' && (
          <div className="mb-4 text-green-600">
            <svg className="h-16 w-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-gray-700">
              Slack has been successfully connected. You can close this window.
            </p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="mb-4 text-red-600">
            <svg className="h-16 w-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <p className="text-gray-700 mb-2">
              Sorry, we couldn't connect to Slack.
            </p>
            <p className="text-sm text-red-500 bg-red-50 p-2 rounded mb-4">
              {errorMessage || 'Unknown error occurred'}
            </p>
          </div>
        )}
        
        <div className="mt-6">
          {status === 'success' && (
            <Button onClick={() => window.close()} className="bg-amber-400 hover:bg-amber-500 text-black">
              Close Window
            </Button>
          )}
          
          {status === 'error' && (
            <div className="space-y-2">
              <Button onClick={() => window.close()} className="w-full mb-2">
                Close Window
              </Button>
              <Link to="/dashboard/add-channel">
                <Button variant="outline" className="w-full">
                  Try Again
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlackCallback;
