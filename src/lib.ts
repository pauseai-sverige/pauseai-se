/** Sökväg inom sajten, med base (t.ex. /pauseai-se) framför. */
export function url(path = '/'): string {
	const base = import.meta.env.BASE_URL.replace(/\/$/, '')
	return base + (path.startsWith('/') ? path : `/${path}`)
}

// Datum utan tid (blogginlägg) lagras som midnatt UTC.
const dateFormat = new Intl.DateTimeFormat('sv-SE', { dateStyle: 'long', timeZone: 'UTC' })
const dateTimeFormat = new Intl.DateTimeFormat('sv-SE', {
	dateStyle: 'full',
	timeStyle: 'short',
	timeZone: 'Europe/Stockholm'
})

const monthFormat = new Intl.DateTimeFormat('sv-SE', { month: 'long', year: 'numeric', timeZone: 'UTC' })

export const formatDate = (date: Date) => dateFormat.format(date)
export const formatMonth = (date: Date) => monthFormat.format(date)
export const formatDateTime = (date: Date) => dateTimeFormat.format(date)

/** Adress till en uppladdad bild. Bilder från Pages CMS börjar med /bilder och behöver base. */
export const imageUrl = (src: string) => (src.startsWith('/') ? url(src) : src)

/** Första stycket i en Markdown-text som vanlig text, kortat till ungefär max tecken. */
export function excerpt(markdown = '', max = 220): string {
	const first = markdown.trim().split(/\n\s*\n/)[0] ?? ''
	const text = first
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/[*_`#>]/g, '')
		.replace(/\s+/g, ' ')
		.trim()
	if (text.length <= max) return text
	return text.slice(0, text.lastIndexOf(' ', max)) + ' …'
}

export const menu = [
	{ href: '/risker', label: 'Risker' },
	{ href: '/forslaget', label: 'Förslaget' },
	{ href: '/engagera-dig', label: 'Engagera dig' },
	{ href: '/evenemang', label: 'Evenemang' },
	{ href: '/blogg', label: 'Blogg' },
	{ href: '/faq', label: 'FAQ' },
	{ href: '/om-oss', label: 'Om oss' }
]

// Ett evenemang räknas som kommande hela dagen det äger rum, i svensk tid, så att det
// inte försvinner från listan mitt under evenemanget.
const dayFormat = new Intl.DateTimeFormat('sv-SE', { dateStyle: 'short', timeZone: 'Europe/Stockholm' })
export const isUpcoming = (date: Date, now = new Date()) => dayFormat.format(date) >= dayFormat.format(now)

/**
 * Groups events with the same title into series, e.g. the recurring member meeting.
 * Keeps the input order: each series sits where its first event was.
 */
export function groupSeries<T extends { data: { title: string } }>(events: T[]): T[][] {
	const series = new Map<string, T[]>()
	for (const event of events) {
		const key = event.data.title.trim().toLowerCase()
		series.set(key, [...(series.get(key) ?? []), event])
	}
	return [...series.values()]
}

interface CalendarEvent {
	id: string
	title: string
	date: Date
	location: string
	description?: string
	pageUrl: string
}

/** Länk som öppnar WhatsApp med en färdig text om evenemanget. */
export function whatsappLink(event: CalendarEvent): string {
	const text = `${event.title}\n${formatDateTime(event.date)}, ${event.location}\n${event.pageUrl}`
	return `https://wa.me/?text=${encodeURIComponent(text)}`
}

// Evenemang har bara en starttid, så i kalendern får de två timmars längd.
const EVENT_LENGTH_MS = 2 * 60 * 60 * 1000

const icsDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
const icsText = (text: string) => text.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1')

/** Raderna i en iCalendar-fil får vara högst 75 byte långa, längre rader viks. */
function fold(line: string): string {
	const out: string[] = []
	let current = ''
	for (const char of line) {
		if (new TextEncoder().encode(current + char).length > 74) {
			out.push(current)
			current = ' '
		}
		current += char
	}
	return [...out, current].join('\r\n')
}

/** En iCalendar-fil (.ics) som kalenderappar kan prenumerera på eller importera. */
export function icsCalendar(events: CalendarEvent[], name = 'PauseAI Sverige'): string {
	const now = icsDate(new Date())
	const lines = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//PauseAI Sverige//pauseai.se//SV',
		'CALSCALE:GREGORIAN',
		'METHOD:PUBLISH',
		`X-WR-CALNAME:${icsText(name)}`,
		'X-WR-TIMEZONE:Europe/Stockholm',
		...events.flatMap((event) => [
			'BEGIN:VEVENT',
			`UID:${event.id}@pauseai.se`,
			`DTSTAMP:${now}`,
			`DTSTART:${icsDate(event.date)}`,
			`DTEND:${icsDate(new Date(event.date.valueOf() + EVENT_LENGTH_MS))}`,
			`SUMMARY:${icsText(event.title)}`,
			`LOCATION:${icsText(event.location)}`,
			`DESCRIPTION:${icsText([event.description, event.pageUrl].filter(Boolean).join('\n\n'))}`,
			`URL:${event.pageUrl}`,
			'END:VEVENT'
		]),
		'END:VCALENDAR'
	]
	return lines.map(fold).join('\r\n') + '\r\n'
}
