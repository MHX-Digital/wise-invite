import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { buildGoogleCalendarUrl } from '@/lib/calendar/google-url'
import { format, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import TrackView from './TrackView'

interface Props {
  params: Promise<{ code: string }>
}

export default async function PublicInvitePage({ params }: Props) {
  const { code } = await params
  const supabase = await createServiceClient()

  const { data: invite } = await supabase
    .from('invites')
    .select('*')
    .eq('share_code', code)
    .eq('status', 'published')
    .single()

  if (!invite) notFound()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://wiseinvite.com.br'

  const googleUrl = buildGoogleCalendarUrl({
    title: invite.title,
    date: invite.event_date,
    time: `${invite.event_time}:00`,
    location: invite.location,
    description: invite.description,
  })

  const icsUrl = `${appUrl}/api/invites/${invite.id}/ics`

  const dateFormatted = format(
    parse(invite.event_date, 'yyyy-MM-dd', new Date()),
    "dd 'de' MMMM 'de' yyyy",
    { locale: ptBR }
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 flex items-center justify-center px-4 py-12">
      <TrackView inviteId={invite.id} />

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-violet-700 px-8 py-10 text-white">
          <p className="text-violet-300 text-xs font-bold uppercase tracking-widest mb-2">Convite</p>
          <h1 className="text-3xl font-bold leading-tight">{invite.title}</h1>
        </div>

        {/* Body */}
        <div className="px-8 py-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-1">Data</p>
              <p className="text-lg font-semibold text-gray-900">{dateFormatted}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-1">Horario</p>
              <p className="text-lg font-semibold text-gray-900">{invite.event_time.slice(0, 5)}</p>
            </div>
          </div>

          {invite.location && (
            <div>
              <p className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-1">Local</p>
              <p className="text-base font-medium text-gray-800">{invite.location}</p>
            </div>
          )}

          {invite.description && (
            <div className="border-t border-gray-100 pt-5">
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{invite.description}</p>
            </div>
          )}

          {/* Calendar buttons */}
          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs text-gray-400 mb-4 font-medium">Adicione ao seu calendario:</p>
            <div className="flex gap-3">
              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-track="google_calendar_click"
                data-invite-id={invite.id}
                className="flex-1 bg-violet-600 text-white text-sm font-semibold py-3 px-4 rounded-xl text-center hover:bg-violet-700 transition-colors"
              >
                Google Calendar
              </a>
              <a
                href={icsUrl}
                data-track="apple_calendar_click"
                data-invite-id={invite.id}
                className="flex-1 border-2 border-violet-600 text-violet-700 text-sm font-semibold py-3 px-4 rounded-xl text-center hover:bg-violet-50 transition-colors"
              >
                Apple Calendar
              </a>
            </div>
          </div>

          {invite.pdf_url && (
            <div className="text-center">
              <a
                href={invite.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 hover:text-violet-600 transition-colors"
              >
                Baixar convite em PDF
              </a>
            </div>
          )}
        </div>

        <div className="px-8 py-3 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">Criado com wise-invite</p>
        </div>
      </div>
    </div>
  )
}
