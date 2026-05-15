import Link from 'next/link'
import { CalendarCheck, FileText, Sparkles, BarChart2, Mail } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-violet-600" />
          <span className="font-bold text-gray-900">wise-invite</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium">Entrar</Link>
          <Link href="/register" className="text-sm bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors font-medium">
            Comecar gratis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Convites com IA + Calendario automatico
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          Seu convidado ve, confirma<br />e bloqueia a data,{' '}
          <span className="text-violet-600">tudo num clique.</span>
        </h1>
        <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
          Crie convites em PDF interativos em minutos. O convidado clica e o evento vai direto
          para o Google Calendar ou Apple Calendar. Sem formulario. Sem confusao.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/register"
            className="bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 transition-colors text-sm"
          >
            Criar meu primeiro convite
          </Link>
          <Link
            href="/login"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm"
          >
            Entrar na conta
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: FileText,
              title: 'PDF interativo',
              desc: 'Convite bonito com links clicaveis para DATA, HORA e LOCAL do evento.',
            },
            {
              icon: CalendarCheck,
              title: 'Calendario automatico',
              desc: 'Um clique e o evento vai direto para Google Calendar ou Apple Calendar.',
            },
            {
              icon: Sparkles,
              title: 'IA generativa',
              desc: 'Claude gera o texto do convite baseado no seu evento. Sem escrever nada.',
            },
            {
              icon: BarChart2,
              title: 'Dashboard de metricas',
              desc: 'Veja quem visualizou e quem adicionou ao calendario em tempo real.',
            },
          ].map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title} className="bg-gray-50 rounded-2xl p-6">
                <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-violet-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Planos simples</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Free',
              price: 'R$0',
              period: '/mes',
              features: ['3 convites por mes', '3 templates', 'Google e Apple Calendar', 'Link de compartilhamento'],
              cta: 'Comecar gratis',
              highlight: false,
            },
            {
              name: 'Pro',
              price: 'R$29',
              period: '/mes',
              features: ['Convites ilimitados', 'IA generativa', 'Dashboard completo', 'Sem branding wise-invite'],
              cta: 'Assinar Pro',
              highlight: true,
            },
            {
              name: 'Business',
              price: 'R$79',
              period: '/mes',
              features: ['Tudo do Pro', 'Multiplos usuarios', 'Analytics avancado', 'Suporte prioritario'],
              cta: 'Assinar Business',
              highlight: false,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 border ${
                plan.highlight
                  ? 'border-violet-600 bg-violet-600 text-white shadow-lg shadow-violet-200'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <h3 className={`font-semibold mb-1 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
              <div className="flex items-end gap-1 mb-5">
                <span className={`text-3xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                <span className={`text-sm mb-1 ${plan.highlight ? 'text-violet-200' : 'text-gray-400'}`}>{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className={`text-sm flex items-start gap-2 ${plan.highlight ? 'text-violet-100' : 'text-gray-600'}`}>
                    <span className={plan.highlight ? 'text-violet-300' : 'text-violet-500'}>v</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`block text-center text-sm font-semibold py-2.5 rounded-xl transition-colors ${
                  plan.highlight
                    ? 'bg-white text-violet-700 hover:bg-violet-50'
                    : 'border border-violet-600 text-violet-700 hover:bg-violet-50'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center">
        <p className="text-sm text-gray-400">2026 wise-invite -- MHX Digital CNPJ 57.435.644/0001-20</p>
      </footer>
    </div>
  )
}
