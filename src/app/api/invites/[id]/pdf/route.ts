import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateInvitePdf } from '@/lib/pdf/generate'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: invite } = await supabase.from('invites').select('*').eq('id', id).single()
  if (!invite) return NextResponse.json({ error: 'Invite not found' }, { status: 404 })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://wiseinvite.com.br'
  const pdfBuffer = await generateInvitePdf(invite, appUrl)

  const fileName = `${invite.org_id}/${id}.pdf`
  const { error: uploadError } = await supabase.storage
    .from('invites-pdf')
    .upload(fileName, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage.from('invites-pdf').getPublicUrl(fileName)

  await supabase.from('invites').update({ pdf_url: publicUrl, status: 'published' }).eq('id', id)

  return NextResponse.json({ pdf_url: publicUrl })
}
