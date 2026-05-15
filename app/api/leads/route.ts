import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const lead = {
      name:        body.name        || '',
      phone:       body.phone       || '',
      email:       body.email       || '',
      event_type:  body.event       || body.eventType || '',
      event_date:  body.eventDate   || null,
      venue:       body.venue       || '',
      guests:      body.guests      || 0,
      message:     body.message     || '',
      status:      'new',
      notes:       body.message     || '',
      source:      body.source      || 'landing_page',
      created_at:  new Date().toISOString(),
      last_contact: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('leads')
      .insert([lead])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, lead: data }, { status: 201 })
  } catch (err) {
    console.error('Lead API error:', err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ leads: data })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
