import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { format, parse, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Invite } from '@/types'

export default async function CalendarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('user_id', user.id).single()
  if (!profile) redirect('/login')

  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  const { data: invites } = await supabase
    .from('invites')
    .select('id, title, event_date, event_time, status, share_code')
    .eq('org_id', profile.org_id)
    .gte('event_date', format(monthStart, 'yyyy-MM-dd'))
    .lte('event_date', format(monthEnd, 'yyyy-MM-dd'))
    .order('event_date')

  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const monthLabel = format(now, "MMMM 'de' yyyy", { locale: ptBR })

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

  // Pad start
  const firstDayOfWeek = monthStart.getDay()

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 capitalize">{monthLabel}</h1>
        <p className="text-sm text-gray-500 mt-0.5">Todos os seus eventos do mes</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Week header */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {weekDays.map((d) => (
            <div key={d} className="py-3 text-center text-xs font-semibold text-gray-400">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-24 border-b border-r border-gray-50 bg-gray-50/50" />
          ))}

          {days.map((day) => {
            const dayInvites = (invites ?? []).filter((inv) =>
              isSameDay(parse(inv.event_date, 'yyyy-MM-dd', new Date()), day)
            )
            const isToday = isSameDay(day, now)

            return (
              <div
                key={day.toISOString()}
                className={`min-h-24 border-b border-r border-gray-100 p-2 ${isToday ? 'bg-violet-50' : ''}`}
              >
                <span className={`text-xs font-semibold inline-flex items-center justify-center w-6 h-6 rounded-full ${
                  isToday ? 'bg-violet-600 text-white' : 'text-gray-500'
                }`}>
                  {format(day, 'd')}
                </span>
                <div className="mt-1 space-y-0.5">
                  {dayInvites.map((inv) => (
                    <a
                      key={inv.id}
                      href={`/invites/${inv.id}`}
                      className={`block text-xs px-1.5 py-0.5 rounded truncate ${
                        inv.status === 'published'
                          ? 'bg-violet-100 text-violet-800 hover:bg-violet-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {inv.event_time.slice(0, 5)} {inv.title}
                    </a>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Upcoming list */}
      {invites && invites.length > 0 && (
        <div className="mt-6 bg-white rounded-xl border border-gray-200 divide-y divide-gray-50">
          <div className="px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-900">Eventos do mes</h2>
          </div>
          {invites.map((inv) => (
            <div key={inv.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-900">{inv.title}</p>
                <p className="text-xs text-gray-400">
                  {format(parse(inv.event_date, 'yyyy-MM-dd', new Date()), "dd MMM", { locale: ptBR })} as {inv.event_time.slice(0, 5)}
                </p>
              </div>
              <a
                href={`/invites/${inv.id}`}
                className="text-xs text-violet-600 hover:underline"
              >
                Ver
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
