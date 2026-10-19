// Hämtar kommande evenemang från vår kalender på Luma (luma.com) när sajten byggs.
// Sajten byggs om varje natt, så nya evenemang på Luma syns här inom ett dygn.

import type { Loader } from 'astro/loaders'

/** Kalenderflödet för kalendern "PauseAI Sweden" på Luma (https://luma.com/PauseAI-Sweden). */
export const LUMA_ICS = 'https://api.lu.ma/ics/get?entity=calendar&id=cal-uTqRuOkL7KPhEu7'

export interface LumaEvent {
	uid: string
	title: string
	date: Date
	/** Adress, eller tomt om Luma bara anger en länk (digitala möten och dolda adresser). */
	address: string
	/** Evenemangets sida på Luma. */
	link: string
	/** Alla adresser som pekar på evenemanget, för att känna igen det i våra egna poster. */
	links: string[]
	host?: string
}

/** Läser händelserna i en iCalendar-fil. Räcker för Lumas flöde, inte för alla kalendrar. */
export function parseIcs(ics: string): LumaEvent[] {
	const lines = ics.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '').split(/\r?\n/)
	const unescape = (text: string) => text.replace(/\\n/gi, '\n').replace(/\\([,;\\])/g, '$1')
	const events: LumaEvent[] = []
	let fields: Record<string, string> | null = null

	for (const line of lines) {
		if (line === 'BEGIN:VEVENT') fields = {}
		else if (line === 'END:VEVENT' && fields) {
			const description = unescape(fields.DESCRIPTION ?? '')
			const location = unescape(fields.LOCATION ?? '').trim()
			const start = fields.DTSTART?.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/)
			if (start && fields.SUMMARY && fields.STATUS !== 'CANCELLED') {
				const [, y, mo, d, h, mi, s] = start.map(Number)
				const links = [...description.matchAll(/https:\/\/luma\.com\/[\w/-]+/g)].map((m) => m[0])
				if (location.startsWith('https://')) links.push(location)
				events.push({
					uid: fields.UID ?? '',
					title: unescape(fields.SUMMARY).trim(),
					date: new Date(Date.UTC(y, mo - 1, d, h, mi, s)),
					address: location.startsWith('https://') ? '' : location,
					link: links[0] ?? location,
					links,
					host: description.match(/Hosted by (.+)/)?.[1]?.trim()
				})
			}
			fields = null
		} else if (fields) {
			const match = line.match(/^([A-Z-]+)(?:;[^:]*)?:(.*)$/)
			if (match) fields[match[1]] = match[2]
		}
	}
	return events
}

/** luma.com/abc och lu.ma/abc är samma sida, med eller utan / på slutet. */
const normalize = (link: string) => link.replace(/^https?:\/\/(www\.)?(lu\.ma|luma\.com)\//, 'luma/').replace(/\/$/, '')

const slugify = (text: string) =>
	text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')

const dayFormat = new Intl.DateTimeFormat('sv-SE', { dateStyle: 'short', timeZone: 'Europe/Stockholm' })

/**
 * Lägger till kommande evenemang från Luma efter dem som laddas av `inner` (våra Markdown-filer).
 * Ett evenemang som redan finns som egen post, med länk till samma Luma-sida, hoppas över.
 * Om Luma inte svarar byggs sajten ändå, med bara våra egna evenemang.
 */
export function withLuma(inner: Loader, ics = LUMA_ICS): Loader {
	return {
		name: 'evenemang-med-luma',
		async load(context) {
			await inner.load(context)
			const { store, logger, parseData, renderMarkdown } = context

			let events: LumaEvent[]
			try {
				const response = await fetch(ics, { signal: AbortSignal.timeout(15_000) })
				if (!response.ok) throw new Error(`HTTP ${response.status}`)
				events = parseIcs(await response.text())
			} catch (error) {
				logger.warn(`Kunde inte hämta evenemang från Luma: ${error}`)
				return
			}

			const ownLinks = new Set(
				store
					.values()
					.map((entry) => entry.data.link)
					.filter((link): link is string => typeof link === 'string')
					.map(normalize)
			)
			const today = dayFormat.format(new Date())
			let added = 0

			for (const event of events) {
				if (dayFormat.format(event.date) < today) continue
				if (event.links.some((link) => ownLinks.has(normalize(link)))) continue

				const id = `${dayFormat.format(event.date)}-${slugify(event.title)}`
				if (store.has(id)) continue

				const body = [
					event.address
						? 'Evenemanget finns i vår kalender på Luma.'
						: 'Evenemanget finns i vår kalender på Luma. Där står det om det är digitalt eller var det hålls, och du får länken eller adressen när du anmäler dig.',
					event.host && `Värd: ${event.host}.`
				]
					.filter(Boolean)
					.join(' ')
				const data = await parseData({
					id,
					data: {
						title: event.title,
						date: event.date,
						location: event.address || 'Se Luma',
						link: event.link
					}
				})
				store.set({ id, data, body, rendered: await renderMarkdown(body) })
				added++
			}
			logger.info(`${added} evenemang från Luma`)
		}
	}
}
