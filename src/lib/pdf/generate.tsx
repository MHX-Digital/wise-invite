import { renderToBuffer, Document, Page, Text, View, StyleSheet, Link, Font } from '@react-pdf/renderer'
import { buildGoogleCalendarUrl } from '@/lib/calendar/google-url'
import { Invite } from '@/types'
import { format, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const TEMPLATE_COLORS: Record<string, { primary: string; accent: string; bg: string }> = {
  classic: { primary: '#5B21B6', accent: '#7C3AED', bg: '#F5F3FF' },
  modern: { primary: '#0F172A', accent: '#3B82F6', bg: '#F0F9FF' },
  minimal: { primary: '#374151', accent: '#6B7280', bg: '#F9FAFB' },
}

function formatDate(dateStr: string): string {
  return format(parse(dateStr, 'yyyy-MM-dd', new Date()), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
}

function formatTime(timeStr: string): string {
  return timeStr.slice(0, 5)
}

export async function generateInvitePdf(invite: Invite, appUrl: string): Promise<Buffer> {
  const colors = TEMPLATE_COLORS[invite.template_id] ?? TEMPLATE_COLORS.classic

  const googleUrl = buildGoogleCalendarUrl({
    title: invite.title,
    date: invite.event_date,
    time: `${invite.event_time}:00`,
    location: invite.location,
    description: invite.description,
  })

  const icsUrl = `${appUrl}/api/invites/${invite.id}/ics`

  const styles = StyleSheet.create({
    page: { backgroundColor: colors.bg, fontFamily: 'Helvetica', padding: 0 },
    header: {
      backgroundColor: colors.primary,
      paddingVertical: 40,
      paddingHorizontal: 48,
      marginBottom: 0,
    },
    headerTitle: { color: '#FFFFFF', fontSize: 26, fontWeight: 'bold', marginBottom: 4 },
    headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 11, letterSpacing: 1.5 },
    body: { paddingHorizontal: 48, paddingTop: 32, paddingBottom: 40 },
    section: { marginBottom: 24 },
    label: { fontSize: 9, color: colors.accent, fontWeight: 'bold', letterSpacing: 1.2, marginBottom: 6, textTransform: 'uppercase' },
    value: { fontSize: 16, color: '#1F2937', fontWeight: 'bold' },
    description: { fontSize: 11, color: '#4B5563', lineHeight: 1.7, marginTop: 8 },
    divider: { borderTopWidth: 1, borderTopColor: colors.accent + '30', marginBottom: 24 },
    calendarSection: { marginTop: 8 },
    calendarTitle: { fontSize: 10, color: '#6B7280', marginBottom: 12 },
    btnRow: { flexDirection: 'row', gap: 12 },
    btn: {
      backgroundColor: colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    btnText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
    btnOutline: {
      borderWidth: 1.5,
      borderColor: colors.primary,
      paddingVertical: 9,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    btnOutlineText: { color: colors.primary, fontSize: 10, fontWeight: 'bold' },
    footer: {
      marginTop: 40,
      borderTopWidth: 1,
      borderTopColor: colors.accent + '20',
      paddingTop: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    footerText: { fontSize: 8, color: '#9CA3AF' },
  })

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerSub}>CONVITE</Text>
          <Text style={styles.headerTitle}>{invite.title}</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.section}>
            <Text style={styles.label}>Data</Text>
            <Text style={styles.value}>{formatDate(invite.event_date)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.label}>Horario</Text>
            <Text style={styles.value}>{formatTime(invite.event_time)}</Text>
          </View>

          {invite.location && (
            <>
              <View style={styles.divider} />
              <View style={styles.section}>
                <Text style={styles.label}>Local</Text>
                <Text style={styles.value}>{invite.location}</Text>
              </View>
            </>
          )}

          {invite.description && (
            <>
              <View style={styles.divider} />
              <View style={styles.section}>
                <Text style={styles.description}>{invite.description}</Text>
              </View>
            </>
          )}

          <View style={styles.divider} />

          <View style={styles.calendarSection}>
            <Text style={styles.calendarTitle}>Adicione ao seu calendario com um clique:</Text>
            <View style={styles.btnRow}>
              <Link src={googleUrl}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Google Calendar</Text>
                </View>
              </Link>
              <Link src={icsUrl}>
                <View style={styles.btnOutline}>
                  <Text style={styles.btnOutlineText}>Apple Calendar</Text>
                </View>
              </Link>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>wise-invite</Text>
            <Text style={styles.footerText}>{appUrl}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )

  return Buffer.from(await renderToBuffer(doc))
}
