import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Eye, CalendarCheck, FileText, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { DashboardStats, InviteWithStats } from '@/types'

async function getStats(orgId: string): Promise<DashboardStats> {
  const supabase = await createClient()

  const [{ count: total }, { count: published }, analyticsRes] = await Promise.all([
    supabase.from('invites').select('*', { count: 'exact', head: true }).eq('org_id', orgId),
    supabase.from('invites').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'published'),
    supabase.from('invite_analytics')
      .select('event_type, invite_id, invites!inner(org_id)')
      .eq('invites.org_id', orgId),
  ])

  const analytics = analyticsRes.data ?? []
  const views = analytics.filter((a) => a.event_type === 'view').length
  const calClicks = analytics.filter(
    (a) => a.event_type === 'google_calendar_click' || a.event_type === 'apple_calendar_click'
  ).length

  return {
    total_invites: total ?? 0,
    published_invites: published ?? 0,
    total_views: views,
    total_calendar_clicks: calClicks,
  }
}

async function getRecentInvites(orgId: string): Promise<InviteWithStats[]> {
  const supabase = await createClient()
  const { data: invites } = await supabase
    .from('invites')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(5)

  if (!invites) return []

  const withStats: InviteWithStats[] = invites.map((inv) => ({
    ...inv,
    views: 0,
    google_clicks: 0,
    apple_clicks: 0,
  }))

  return withStats
}

const statCards = [
  { label: 'Total de convites', key: 'total_invites' as const, icon: FileText, color: 'text-violet-600 bg-violet-50' },
  { label: 'Publicados', key: 'published_invites' as const, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
  { label: 'Visualizações', key: 'total_views' as const, icon: Eye, color: 'text-blue-600 bg-blue-50' },
  { label: 'Cliques no calendário', key: 'total_calendar_clicks' as const, icon: CalendarCheck, color: 'text-orange-600 bg-orange-50' },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('user_id', user.id).single()
  if (!profile) redirect('/login')

  const [stats, recentInvites] = await Promise.all([
    getStats(profile.org_id),
    getRecentInvites(profile.org_id),
  ])

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Visao geral dos seus convites</p>
        </div>
        <Link
          href="/invites/new"
          className="bg-violet-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors font-medium"
        >
          Novo convite
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.key} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 font-medium">{card.label}</span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${card.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats[card.key]}</p>
            </div>
          )
        })}
      </div>

      {/* Recent invites */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Convites recentes</h2>
          <Link href="/invites" className="text-xs text-violet-600 hover:underline">Ver todos</Link>
        </div>
        {recentInvites.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-gray-400">Nenhum convite criado ainda.</p>
            <Link href="/invites/new" className="text-sm text-violet-600 hover:underline mt-1 inline-block">
              Criar primeiro convite
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentInvites.map((invite) => (
              <div key={invite.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">{invite.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{invite.event_date} as {invite.event_time.slice(0,5)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    invite.status === 'published'
                      ? 'bg-green-50 text-green-700'
                      : invite.status === 'expired'
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {invite.status === 'published' ? 'Publicado' : invite.status === 'expired' ? 'Expirado' : 'Rascunho'}
                  </span>
                  <Link href={`/invites/${invite.id}`} className="text-xs text-violet-600 hover:underline">
                    Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
