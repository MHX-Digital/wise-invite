import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { z } from 'zod'

const FREE_LIMIT = 3

const createSchema = z.object({
  title: z.string().min(1).max(120),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  event_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
  location: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
  template_id: z.enum(['classic', 'modern', 'minimal']).default('classic'),
})

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('user_id', user.id).single()
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const { data: invites, error } = await supabase
    .from('invites')
    .select('*')
    .eq('org_id', profile.org_id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ invites })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id, organizations(plan, invite_count)')
    .eq('user_id', user.id)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const org = (profile as any).organizations
  if (org?.plan === 'free' && (org?.invite_count ?? 0) >= FREE_LIMIT) {
    return NextResponse.json(
      { error: 'Limite de 3 convites no plano gratuito atingido. Faça upgrade para Pro.' },
      { status: 403 }
    )
  }

  const { data: invite, error } = await supabase
    .from('invites')
    .insert({ ...parsed.data, org_id: profile.org_id })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Increment invite count
  await supabase
    .from('organizations')
    .update({ invite_count: (org?.invite_count ?? 0) + 1 })
    .eq('id', profile.org_id)

  return NextResponse.json({ invite }, { status: 201 })
}
