
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const DISCORD_CLIENT_ID = Deno.env.get('DISCORD_CLIENT_ID')
const DISCORD_CLIENT_SECRET = Deno.env.get('DISCORD_CLIENT_SECRET')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { code } = await req.json()

    if (!code) {
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

    // Exchange code for access token
    const redirectUri = `${SUPABASE_URL}/functions/v1/discord-auth`
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID!,
        client_secret: DISCORD_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    })

    const tokenData = await tokenResponse.json()
    
    if (!tokenResponse.ok) {
      throw new Error(`Discord token exchange failed: ${JSON.stringify(tokenData)}`)
    }

    // Get guild (server) information
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    
    const userData = await userResponse.json()
    
    if (!userResponse.ok) {
      throw new Error(`Failed to fetch Discord user data: ${JSON.stringify(userData)}`)
    }

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
