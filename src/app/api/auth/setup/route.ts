import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { name, userId } = await req.json()
    if (!name || !userId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const supabase = await createServiceClient()

    // Create organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({ name })
      .select('id')
      .single()

    if (orgError) return NextResponse.json({ error: orgError.message }, { status: 500 })

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ user_id: userId, org_id: org.id, full_name: name })

    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
