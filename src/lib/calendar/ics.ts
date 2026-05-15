import { format, parse, addHours } from 'date-fns'

interface IcsParams {
  id: string
  title: string
  date: string
  time: string
  location?: string | null
  description?: string | null
}

function toIcsDatetime(date: string, time: string): string {
  const dt = parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm:ss', new Date())
  return format(dt, "yyyyMMdd'T'HHmmss")
}

export function generateIcsContent(params: IcsParams): string {
  const { id, title, date, time, location, description } = params
  const start = toIcsDatetime(date, time)
  const end = format(
    addHours(parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm:ss', new Date()), 2),
    "yyyyMMdd'T'HHmmss"
  )
  const now = format(new Date(), "yyyyMMdd'T'HHmmss'Z'")

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//wise-invite//wise-invite//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${id}@wiseinvite`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
  ]

  if (description) lines.push(`DESCRIPTION:${description.replace(/\n/g, '\\n')}`)
  if (location) lines.push(`LOCATION:${location}`)

  lines.push('END:VEVENT', 'END:VCALENDAR')

  return lines.join('\r\n')
}
