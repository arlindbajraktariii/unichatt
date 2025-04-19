
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const SLACK_CLIENT_ID = Deno.env.get('SLACK_CLIENT_ID')
const SLACK_CLIENT_SECRET = Deno.env.get('SLACK_CLIENT_SECRET')
const REDIRECT_URI = 'https://zodvzryuvcxkksjozujq.supabase.co/functions/v1/slack-auth'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const code = url.searchParams.get('code')

  // Log the current environment variables (without revealing the full secret)
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
    // If no code, redirect to Slack OAuth
    const authUrl = `https://slack.com/oauth/v2/authorize?client_id=${SLACK_CLIENT_ID}&scope=channels:history,channels:read,chat:write,users:read&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`
    
    console.log('Redirecting to Slack OAuth with URL:', authUrl)
    return new Response(JSON.stringify({ url: authUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    console.log('Received code from Slack, exchanging for access token')
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

    // Return the access token and other relevant data
    return new Response(
      JSON.stringify({
        access_token: data.access_token,
        team_name: data.team?.name,
        team_id: data.team?.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in Slack auth flow:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to complete OAuth flow', details: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
