
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const SLACK_CLIENT_ID = Deno.env.get('SLACK_CLIENT_ID')
const SLACK_CLIENT_SECRET = Deno.env.get('SLACK_CLIENT_SECRET')
const REDIRECT_URI = 'https://zodvzryuvcxkksjozujq.supabase.co/functions/v1/slack-auth'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const code = url.searchParams.get('code')

  console.log('Request received:', req.method, url.pathname)
  console.log('Code available:', code ? 'Yes' : 'No')
  
  // Check if credentials are available
  console.log(`SLACK_CLIENT_ID available: ${SLACK_CLIENT_ID ? 'Yes' : 'No'}`)
  console.log(`SLACK_CLIENT_SECRET available: ${SLACK_CLIENT_SECRET ? 'Yes' : 'No'}`)
  
  if (!SLACK_CLIENT_ID || !SLACK_CLIENT_SECRET) {
    console.error('Missing Slack credentials - please check your Supabase secrets')
    return new Response(
      JSON.stringify({ 
        error: 'Configuration error', 
        details: 'Missing Slack credentials. Please set SLACK_CLIENT_ID and SLACK_CLIENT_SECRET in Supabase secrets.' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  if (!code) {
    // If no code, return the auth URL for frontend to open
    const authUrl = `https://slack.com/oauth/v2/authorize?client_id=${SLACK_CLIENT_ID}&scope=channels:history,channels:read,chat:write,users:read&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`
    
    console.log('Generating Slack OAuth URL:', authUrl)
    return new Response(JSON.stringify({ url: authUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    console.log('Exchanging code for access token')
    // Exchange code for access token
    const response = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: SLACK_CLIENT_ID,
        client_secret: SLACK_CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
      }),
    })

    const data = await response.json()
    console.log('Slack API response status:', data.ok ? 'Success' : 'Failed')
    
    if (!data.ok) {
      console.error('Error from Slack API:', data.error)
      throw new Error(`Failed to get access token: ${data.error}`)
    }

    // Return HTML with script to pass data back to opener window
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Slack Authentication Complete</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 40px; }
            .success { color: #4CAF50; }
            .loading { margin: 20px 0; }
          </style>
        </head>
        <body>
          <h2 class="success">Authentication Successful!</h2>
          <p>You can close this window now.</p>
          <div class="loading">Completing connection...</div>
          
          <script>
            // Send message to parent window
            window.opener.postMessage({
              type: 'SLACK_OAUTH_CALLBACK',
              access_token: '${data.access_token}',
              team_name: '${data.team?.name || "Slack Workspace"}',
              team_id: '${data.team?.id || ""}'
            }, '*');
            
            // Close window after short delay
            setTimeout(() => {
              window.close();
            }, 1000);
          </script>
        </body>
      </html>
    `;

    return new Response(html, {
      headers: { ...corsHeaders, 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Error in Slack auth flow:', error)
    
    // Return error HTML
    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Slack Authentication Failed</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 40px; }
            .error { color: #F44336; }
          </style>
        </head>
        <body>
          <h2 class="error">Authentication Failed</h2>
          <p>${error.message || 'There was an error connecting to Slack.'}</p>
          
          <script>
            // Send error message to parent window
            window.opener.postMessage({
              type: 'SLACK_OAUTH_ERROR',
              error: '${error.message || 'There was an error connecting to Slack.'}'
            }, '*');
            
            // Close window after short delay
            setTimeout(() => {
              window.close();
            }, 5000);
          </script>
        </body>
      </html>
    `;
    
    return new Response(errorHtml, {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'text/html' },
    });
  }
})
