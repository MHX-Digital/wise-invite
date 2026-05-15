import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateInviteDescription } from '@/lib/ai/claude'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(1).max(120),
  date: z.string(),
  time: z.string(),
  location: z.string().optional(),
  theme: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check plan allows AI
  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id, organizations(plan)')
    .eq('user_id', user.id)
    .single()

  const plan = (profile as any)?.organizations?.plan ?? 'free'
  if (plan === 'free') {
    return NextResponse.json(
      { error: 'A IA generativa esta disponivel no plano Pro. Faca upgrade para usar.' },
      { status: 403 }
    )
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  try {
    const description = await generateInviteDescription(parsed.data)
    return NextResponse.json({ description })
  } catch {
    return NextResponse.json({ error: 'Erro ao gerar texto. Tente novamente.' }, { status: 500 })
  }
}
