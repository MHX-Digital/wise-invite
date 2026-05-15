import Link from 'next/link'
import {
  LayoutDashboard, FileText, Calendar, Sparkles, Mail, LogOut,
  Eye, CalendarCheck, TrendingUp, Plus, ExternalLink,
} from 'lucide-react'

const MOCK_STATS = {
  total_invites: 12,
  published_invites: 8,
  total_views: 347,
  total_calendar_clicks: 189,
}

const MOCK_INVITES = [
  { id: '1', title: 'Workshop de Marketing Digital', event_date: '2026-06-10', event_time: '14:00', location: 'Sala de Reunioes - Piso 3', status: 'published', share_code: 'abc123' },
  { id: '2', title: 'Aniversario de 30 Anos - Ana Paula', event_date: '2026-06-22', event_time: '19:00', location: 'Espaco Villa Eventos', status: 'published', share_code: 'def456' },
  { id: '3', title: 'Treinamento Equipe Comercial', event_date: '2026-07-05', event_time: '09:00', location: 'Online via Google Meet', status: 'draft', share_code: '' },
  { id: '4', title: 'Formatura Turma 2026 - ADM', event_date: '2026-07-18', event_time: '20:00', location: 'Teatro Municipal', status: 'published', share_code: 'ghi789' },
  { id: '5', title: 'Reuniao de Apresentacao Q3', event_date: '2026-08-01', event_time: '10:00', location: null, status: 'draft', share_code: '' },
]

const navItems = [
  { href: '#dashboard', label: 'Dashboard', icon: LayoutDashboard, active: true },
  { href: '#invites', label: 'Convites', icon: FileText, active: false },
  { href: '#calendar', label: 'Calendario', icon: Calendar, active: false },
  { href: '#ai', label: 'IA Automatica', icon: Sparkles, active: false },
]

const statCards = [
  { label: 'Total de convites', value: MOCK_STATS.total_invites, icon: FileText, color: 'text-violet-600 bg-violet-50' },
  { label: 'Publicados', value: MOCK_STATS.published_invites, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
  { label: 'Visualizacoes', value: MOCK_STATS.total_views, icon: Eye, color: 'text-blue-600 bg-blue-50' },
  { label: 'Cliques no calendario', value: MOCK_STATS.total_calendar_clicks, icon: CalendarCheck, color: 'text-orange-600 bg-orange-50' },
]

export default function DemoPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Demo banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-violet-600 text-white text-xs text-center py-1.5 font-medium">
        MODO DEMONSTRACAO — dados simulados. Configure o Supabase para ativar a conta real.
      </div>

      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col pt-7">
        <div className="px-4 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-violet-600" />
            <span className="font-bold text-gray-900 text-sm">wise-invite</span>
          </div>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  item.active
                    ? 'bg-violet-50 text-violet-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </a>
            )
          })}
        </nav>

        <div className="px-2 py-4 border-t border-gray-100">
          <div className="px-3 py-1.5 mb-1">
            <p className="text-xs text-gray-400 truncate">teste@gmail.com</p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto pt-7">
        <div className="p-6 max-w-5xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-0.5">Visao geral dos seus convites</p>
            </div>
            <button className="flex items-center gap-1.5 bg-violet-600 text-white text-sm px-4 py-2 rounded-lg font-medium cursor-default">
              <Plus className="w-4 h-4" />
              Novo convite
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card) => {
              const Icon = card.icon
              return (
                <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 font-medium">{card.label}</span>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${card.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              )
            })}
          </div>

          {/* Invite list */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Convites recentes</h2>
              <span className="text-xs text-violet-600">Ver todos</span>
            </div>
            <div className="divide-y divide-gray-50">
              {MOCK_INVITES.map((invite) => (
                <div key={invite.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{invite.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {invite.event_date} as {invite.event_time}
                      {invite.location ? ` — ${invite.location}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      invite.status === 'published'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {invite.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </span>
                    {invite.status === 'published' && (
                      <span className="text-gray-300">
                        <ExternalLink className="w-4 h-4" />
                      </span>
                    )}
                    <span className="text-xs text-violet-600 font-medium">Editar</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mini calendar preview */}
          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-violet-600" />
              Proximos eventos — Junho 2026
            </h2>
            <div className="space-y-2">
              {MOCK_INVITES.filter(i => i.status === 'published').slice(0, 3).map((invite) => (
                <div key={invite.id} className="flex items-center gap-3 text-sm">
                  <div className="w-10 text-center">
                    <span className="text-xs font-bold text-violet-600">{invite.event_date.split('-')[2]}</span>
                    <p className="text-xs text-gray-400">Jun</p>
                  </div>
                  <div className="flex-1 bg-violet-50 rounded-lg px-3 py-2">
                    <p className="font-medium text-gray-900 text-xs">{invite.title}</p>
                    <p className="text-xs text-gray-400">{invite.event_time} — {invite.location ?? 'Online'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI tab preview */}
          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-600" />
              IA Automatica — exemplo de texto gerado
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <p className="text-xs text-gray-400 mb-2 font-medium">Evento: Workshop de Marketing Digital</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Voce esta convidado para uma experiencia transformadora no mundo do marketing digital.
                Neste workshop exclusivo, vamos explorar as estrategias mais eficazes para ampliar
                sua presenca online e converter audiencia em resultados reais.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed mt-2">
                Prepare-se para uma tarde de aprendizado pratico, networking qualificado e insights
                que vao mudar a forma como voce pensa sobre marketing. Vagas limitadas — confirme
                sua presenca e bloqueie ja a data na sua agenda.
              </p>
            </div>
            <p className="text-xs text-gray-400 mt-2">Gerado pelo Claude Haiku em 2.3s</p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 mb-3">Configure o Supabase para ativar todas as funcionalidades</p>
            <Link
              href="/"
              className="text-xs text-violet-600 hover:underline"
            >
              Voltar para o inicio
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
