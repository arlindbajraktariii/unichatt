
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const DISCORD_CLIENT_ID = Deno.env.get('DISCORD_CLIENT_ID')
const DISCORD_CLIENT_SECRET = Deno.env.get('DISCORD_CLIENT_SECRET')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')

serve(async (req) => {
  console.log('Discord auth function called')
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Check if this is a callback from Discord with the code
    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    const guildId = url.searchParams.get('guild_id')
    
    console.log('Request URL:', req.url)
    console.log('Code present:', !!code)
    if (guildId) console.log('Guild ID:', guildId)

    // If no code in URL params, try to parse the request body
    let bodyCode = null
    if (!code && req.method === 'POST') {
      try {
        const body = await req.json()
        bodyCode = body?.code
        console.log('Body code present:', !!bodyCode)
      } catch (error) {
        console.error('Error parsing request body:', error)
        // Continue execution - body might be empty which is valid for initial auth URL requests
      }
    }

    // Use code from either URL params or request body
    const authCode = code || bodyCode

    // If no auth code was found in either place, generate the auth URL
    if (!authCode) {
      console.log('No auth code found, generating auth URL')
      
      // Verify that we have client ID
      if (!DISCORD_CLIENT_ID) {
        throw new Error('Discord client ID is not configured')
      }
      
      const scopes = ['bot', 'identify', 'guilds', 'messages.read']
      const redirectUri = `${SUPABASE_URL}/functions/v1/discord-auth`
      
      const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes.join(' '))}`
      
      console.log('Generated auth URL:', authUrl)
      
      return new Response(
        JSON.stringify({ url: authUrl }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    console.log('Auth code found, exchanging for token')

    // Verify that we have client ID and secret
    if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) {
      throw new Error('Discord client ID or secret is not configured')
    }

    // Exchange code for access token
    const redirectUri = `${SUPABASE_URL}/functions/v1/discord-auth`
    
    console.log('Attempting token exchange with redirect URI:', redirectUri)
    
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: redirectUri,
      }),
    })

    const tokenData = await tokenResponse.json()
    
    console.log('Token response status:', tokenResponse.status)
    
    if (!tokenResponse.ok) {
      console.error('Discord token exchange error:', tokenData)
      throw new Error(`Discord token exchange failed: ${JSON.stringify(tokenData)}`)
    }

    // Get user information
    console.log('Getting user information')
    
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    
    const userData = await userResponse.json()
    
    console.log('User response status:', userResponse.status)
    
    if (!userResponse.ok) {
      console.error('Discord user data fetch error:', userData)
      throw new Error(`Failed to fetch Discord user data: ${JSON.stringify(userData)}`)
    }

    console.log('Auth successful, returning user data')

    // If this is a callback (code in URL), output a page that posts a message to the parent window
    if (code) {
      const htmlResponse = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Discord Authentication Successful</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background-color: #f5f5f5;
                flex-direction: column;
              }
              .success-card {
                background: white;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 500px;
              }
              h1 {
                color: #5865F2;
                margin-bottom: 1rem;
              }
              p {
                color: #4F5660;
                margin-bottom: 2rem;
              }
              .loader {
                border: 4px solid #f3f3f3;
                border-top: 4px solid #5865F2;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                animation: spin 1s linear infinite;
                margin: 0 auto;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            </style>
          </head>
          <body>
            <div class="success-card">
              <h1>Authentication Successful!</h1>
              <p>Discord connection has been established. You can close this window and return to the application.</p>
              <div class="loader"></div>
            </div>
            <script>
              // Attempt to send the message to the parent window
              try {
                if (window.opener) {
                  window.opener.postMessage({
                    type: 'DISCORD_OAUTH_CALLBACK',
                    access_token: '${tokenData.access_token}',
                    refresh_token: '${tokenData.refresh_token || ""}',
                    user_id: '${userData.id}',
                    user_name: '${userData.username.replace(/'/g, "\\'")}'
                  }, '*');
                  
                  // Auto close after 3 seconds
                  setTimeout(() => {
                    window.close();
                  }, 3000);
                } else {
                  console.error('No opener window found');
                  document.body.innerHTML += '<p style="color: red">Error: Could not communicate with the main application. Please close this window and try again.</p>';
                }
              } catch (e) {
                console.error('Error posting message:', e);
                document.body.innerHTML += '<p style="color: red">Error: ' + e.message + '</p>';
              }
            </script>
          </body>
        </html>
      `;
      
      return new Response(
        htmlResponse,
        {
          headers: { ...corsHeaders, 'Content-Type': 'text/html' },
          status: 200,
        }
      )
    }

    // If this is an API request (code in body), return JSON
    return new Response(
      JSON.stringify({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        user_name: userData.username,
        user_id: userData.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Discord auth error:', error)
    
    // Return a friendly error page if this was a callback with code in URL
    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    
    if (code) {
      const errorHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Discord Authentication Failed</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background-color: #f5f5f5;
                flex-direction: column;
              }
              .error-card {
                background: white;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 500px;
              }
              h1 {
                color: #ED4245;
                margin-bottom: 1rem;
              }
              p {
                color: #4F5660;
                margin-bottom: 1rem;
              }
              .error-details {
                background: #f9f9f9;
                padding: 1rem;
                border-radius: 4px;
                text-align: left;
                font-family: monospace;
                margin-top: 1rem;
              }
              button {
                background: #5865F2;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 1rem;
              }
            </style>
          </head>
          <body>
            <div class="error-card">
              <h1>Authentication Failed</h1>
              <p>We encountered an error while connecting to Discord:</p>
              <div class="error-details">
                ${error.message}
              </div>
              <p>Please close this window and try again.</p>
              <button onclick="window.close()">Close Window</button>
            </div>
            <script>
              // Notify the opener that there was an error
              try {
                if (window.opener) {
                  window.opener.postMessage({
                    type: 'DISCORD_OAUTH_ERROR',
                    error: '${error.message.replace(/'/g, "\\'")}'
                  }, '*');
                }
              } catch (e) {
                console.error('Error posting error message:', e);
              }
            </script>
          </body>
        </html>
      `;
      
      return new Response(
        errorHtml,
        {
          headers: { ...corsHeaders, 'Content-Type': 'text/html' },
          status: 200, // Return 200 even for errors so the HTML displays properly
        }
      )
    }
    
    // For API requests, return JSON error
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
