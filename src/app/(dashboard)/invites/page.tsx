import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Eye, ExternalLink } from 'lucide-react'
import { Invite } from '@/types'
import { format, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default async function InvitesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('user_id', user.id).single()
  if (!profile) redirect('/login')

  const { data: invites } = await supabase
    .from('invites')
    .select('*')
    .eq('org_id', profile.org_id)
    .order('created_at', { ascending: false })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Convites</h1>
        <Link
          href="/invites/new"
          className="flex items-center gap-1.5 bg-violet-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Novo convite
        </Link>
      </div>

      {!invites || invites.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
          <p className="text-gray-400 text-sm mb-3">Nenhum convite ainda.</p>
          <Link href="/invites/new" className="text-violet-600 text-sm font-medium hover:underline">
            Criar meu primeiro convite
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {(invites as Invite[]).map((invite) => {
            const dateFormatted = format(
              parse(invite.event_date, 'yyyy-MM-dd', new Date()),
              "dd MMM yyyy", { locale: ptBR }
            )
            return (
              <div key={invite.id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between hover:border-violet-200 transition-colors">
                <div>
                  <p className="font-semibold text-gray-900">{invite.title}</p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {dateFormatted} as {invite.event_time.slice(0, 5)}
                    {invite.location ? ` — ${invite.location}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    invite.status === 'published'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {invite.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </span>
                  {invite.status === 'published' && (
                    <a
                      href={`${appUrl}/invite/${invite.share_code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-violet-600 transition-colors"
                      title="Ver convite publico"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <Link
                    href={`/invites/${invite.id}`}
                    className="text-sm text-violet-600 font-medium hover:underline"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
