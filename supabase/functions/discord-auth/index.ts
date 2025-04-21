
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4"

const DISCORD_CLIENT_ID = Deno.env.get('DISCORD_CLIENT_ID')
const DISCORD_CLIENT_SECRET = Deno.env.get('DISCORD_CLIENT_SECRET')
const REDIRECT_URI = 'https://zodvzryuvcxkksjozujq.supabase.co/functions/v1/discord-auth'
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Log the authorization header for debugging
  const authHeader = req.headers.get('authorization')
  console.log('Authorization header present:', authHeader ? 'Yes' : 'No')
  
  // Check client credentials
  if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) {
    console.error('Missing Discord credentials - please check your Supabase secrets')
    return new Response(
      JSON.stringify({ 
        error: 'Configuration error', 
        details: 'Missing Discord credentials. Please set DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET in Supabase secrets.' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  const url = new URL(req.url)
  const code = url.searchParams.get('code')

  console.log('Request received:', req.method, url.pathname)
  console.log('Code available:', code ? 'Yes' : 'No')

  if (!code) {
    // If no code, return the auth URL for frontend to open
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20guilds`
    
    console.log('Generating Discord OAuth URL:', authUrl)
    return new Response(JSON.stringify({ url: authUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    console.log('Exchanging code for access token')
    // Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
      }),
    })

    const tokenData = await tokenResponse.json()
    
    if (!tokenResponse.ok) {
      console.error('Error from Discord API:', tokenData)
      throw new Error(`Failed to get access token: ${tokenData.error || 'Unknown error'}`)
    }

    // Get user information
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const userData = await userResponse.json()

    if (!userResponse.ok) {
      console.error('Error fetching Discord user:', userData)
      throw new Error(`Failed to get user data: ${userData.message || 'Unknown error'}`)
    }

    // Return HTML with script to pass data back to opener window
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Discord Authentication Complete</title>
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
              type: 'DISCORD_OAUTH_CALLBACK',
              access_token: '${tokenData.access_token}',
              refresh_token: '${tokenData.refresh_token || ""}',
              user_id: '${userData.id}',
              user_name: '${userData.username}'
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
    console.error('Error in Discord auth flow:', error)
    
    // Return error HTML
    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Discord Authentication Failed</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 40px; }
            .error { color: #F44336; }
          </style>
        </head>
        <body>
          <h2 class="error">Authentication Failed</h2>
          <p>${error.message || 'There was an error connecting to Discord.'}</p>
          
          <script>
            // Send error message to parent window
            window.opener.postMessage({
              type: 'DISCORD_OAUTH_ERROR',
              error: '${error.message || 'There was an error connecting to Discord.'}'
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
