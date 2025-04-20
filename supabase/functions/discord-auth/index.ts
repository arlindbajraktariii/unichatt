
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const DISCORD_CLIENT_ID = Deno.env.get('DISCORD_CLIENT_ID')
const DISCORD_CLIENT_SECRET = Deno.env.get('DISCORD_CLIENT_SECRET')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Check if this is a callback from Discord with the code
    const url = new URL(req.url)
    const code = url.searchParams.get('code')

    // If no code in URL params, try to parse the request body
    let bodyCode = null
    if (!code && req.method === 'POST') {
      try {
        const body = await req.json()
        bodyCode = body?.code
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
    
    if (!tokenResponse.ok) {
      console.error('Discord token exchange error:', tokenData)
      throw new Error(`Discord token exchange failed: ${JSON.stringify(tokenData)}`)
    }

    // Get user information
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    
    const userData = await userResponse.json()
    
    if (!userResponse.ok) {
      console.error('Discord user data fetch error:', userData)
      throw new Error(`Failed to fetch Discord user data: ${JSON.stringify(userData)}`)
    }

    console.log('Auth successful, returning user data')

    // If this is a callback (code in URL), output a page that posts a message to the parent window
    if (code) {
      return new Response(
        `
        <!DOCTYPE html>
        <html>
          <head><title>Discord Authentication Successful</title></head>
          <body>
            <h1>Authentication Successful!</h1>
            <p>You can close this window and return to the application.</p>
            <script>
              window.opener.postMessage({
                type: 'DISCORD_OAUTH_CALLBACK',
                access_token: '${tokenData.access_token}',
                refresh_token: '${tokenData.refresh_token || ""}',
                user_id: '${userData.id}',
                user_name: '${userData.username.replace(/'/g, "\\'")}'
              }, '*');
            </script>
          </body>
        </html>
        `,
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
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
