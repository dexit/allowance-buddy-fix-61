import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const HUBSPOT_API_KEY = Deno.env.get('HUBSPOT_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_ANON_KEY!
    )

    const { submissionId, userInfo } = await req.json()

    // Log to external_submissions table
    const { error: logError } = await supabase
      .from('external_submissions')
      .insert({
        submission_id: submissionId,
        external_service: 'hubspot',
        status: 'pending'
      })

    if (logError) throw logError

    // Submit to HubSpot
    const response = await fetch('https://api.hubapi.com/contacts/v1/contact/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUBSPOT_API_KEY}`
      },
      body: JSON.stringify({
        properties: [
          { property: 'email', value: userInfo.email },
          { property: 'firstname', value: userInfo.name }
        ]
      })
    })

    const hubspotData = await response.json()

    // Update submission status
    await supabase
      .from('external_submissions')
      .update({
        status: response.ok ? 'success' : 'error',
        response: hubspotData
      })
      .eq('submission_id', submissionId)

    return new Response(
      JSON.stringify(hubspotData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.ok ? 200 : 400
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})