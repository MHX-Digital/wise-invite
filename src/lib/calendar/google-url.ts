import { format, parse, addHours } from 'date-fns'

interface CalendarUrlParams {
  title: string
  date: string
  time: string
  location?: string | null
  description?: string | null
}

function toGoogleDatetime(date: string, time: string): string {
  const dt = parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm:ss', new Date())
  return format(dt, "yyyyMMdd'T'HHmmss")
}

export function buildGoogleCalendarUrl(params: CalendarUrlParams): string {
  const { title, date, time, location, description } = params
  const start = toGoogleDatetime(date, time)
  const end = format(
    addHours(parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm:ss', new Date()), 2),
    "yyyyMMdd'T'HHmmss"
  )

  const url = new URL('https://calendar.google.com/calendar/render')
  url.searchParams.set('action', 'TEMPLATE')
  url.searchParams.set('text', title)
  url.searchParams.set('dates', `${start}/${end}`)
  if (description) url.searchParams.set('details', description)
  if (location) url.searchParams.set('location', location)

  return url.toString()
}
