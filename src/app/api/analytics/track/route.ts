import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { AnalyticsEvent } from '@/types'
import { createHash } from 'crypto'

const VALID_EVENTS: AnalyticsEvent[] = ['view', 'google_calendar_click', 'apple_calendar_click', 'share']

export async function POST(req: NextRequest) {
  try {
    const { invite_id, event_type } = await req.json()

    if (!invite_id || !VALID_EVENTS.includes(event_type)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
    const ip_hash = createHash('sha256').update(ip).digest('hex').slice(0, 16)
    const user_agent = req.headers.get('user-agent')?.slice(0, 200) ?? null

    const supabase = await createServiceClient()
    await supabase.from('invite_analytics').insert({ invite_id, event_type, ip_hash, user_agent })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
