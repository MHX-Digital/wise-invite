import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateIcsContent } from '@/lib/calendar/ics'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: invite, error } = await supabase
    .from('invites')
    .select('*')
    .eq('id', id)
    .eq('status', 'published')
    .single()

  if (error || !invite) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const timeStr = invite.event_time.includes(':') && invite.event_time.split(':').length === 2
    ? `${invite.event_time}:00`
    : invite.event_time

  const icsContent = generateIcsContent({
    id: invite.id,
    title: invite.title,
    date: invite.event_date,
    time: timeStr,
    location: invite.location,
    description: invite.description,
  })

  return new NextResponse(icsContent, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(invite.title)}.ics"`,
      'Cache-Control': 'no-cache',
    },
  })
}
