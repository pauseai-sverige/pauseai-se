// Hämtar kommande evenemang från vår kalender på Luma (luma.com) när sajten byggs.
// Sajten byggs om varje natt, så nya evenemang på Luma syns här inom ett dygn.

import type { Loader } from 'astro/loaders'
import { excerpt } from './lib'

/** Kalenderflödet för kalendern "PauseAI Sweden" på Luma (https://luma.com/PauseAI-Sweden). */
export const LUMA_ICS = 'https://api.lu.ma/ics/get?entity=calendar&id=cal-uTqRuOkL7KPhEu7'

// Events added to the calendar from elsewhere (e.g. Meetup) only link to the calendar page in
// their description; their own page is in LOCATION.
const CALENDAR_PAGE = /^https:\/\/luma\.com\/PauseAI-Sweden$/i

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
				const links = [...description.matchAll(/https:\/\/luma\.com\/[\w/-]+/g)]
					.map((m) => m[0])
					.filter((link) => !CALENDAR_PAGE.test(link))
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

/** An event page on Luma, as opposed to e.g. Meetup for events added from elsewhere. */
const LUMA_PAGE = /^https:\/\/(www\.)?(lu\.ma|luma\.com)\//

export interface EventPage {
	description?: string
	online: boolean
}

/**
 * Reads the schema.org Event that Luma embeds as JSON-LD in each event page. The iCalendar
 * feed has neither the description nor whether the event is online.
 */
export function parseEventPage(html: string): EventPage {
	for (const [, json] of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
		const event = JSON.parse(json)
		if (event?.['@type'] !== 'Event') continue
		const description = typeof event.description === 'string' ? event.description.trim() : ''
		return {
			description: description || undefined,
			online: event.eventAttendanceMode === 'https://schema.org/OnlineEventAttendanceMode'
		}
	}
	throw new Error('no schema.org Event on the page')
}

const escapeHtml = (text: string) =>
	text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Plain text as HTML: blank lines separate paragraphs, other line breaks are kept, URLs become links. */
export function textToHtml(text: string): string {
	return text
		.trim()
		.split(/\n\s*\n/)
		.map((paragraph) => {
			const html = escapeHtml(paragraph.trim())
				.replace(/https?:\/\/[^\s<]*[^\s<.,;:!?)]/g, (link) => `<a href="${link}">${link}</a>`)
				.replace(/\n/g, '<br>\n')
			return `<p>${html}</p>`
		})
		.join('\n')
}

async function fetchEventPage(link: string): Promise<EventPage> {
	const response = await fetch(link, { signal: AbortSignal.timeout(15_000) })
	if (!response.ok) throw new Error(`HTTP ${response.status}`)
	return parseEventPage(await response.text())
}

/**
 * Lägger till kommande evenemang från Luma efter dem som laddas av `inner` (våra Markdown-filer).
 * Ett evenemang som redan finns som egen post, med länk till samma Luma-sida, hoppas över.
 * Beskrivningen hämtas från evenemangets sida på Luma.
 * Om Luma inte svarar byggs sajten ändå, med bara våra egna evenemang eller utan beskrivningar.
 */
export function withLuma(inner: Loader, ics = LUMA_ICS): Loader {
	return {
		name: 'evenemang-med-luma',
		async load(context) {
			await inner.load(context)
			const { store, logger, parseData } = context

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
			const toAdd = new Map<string, LumaEvent>()
			for (const event of events) {
				if (dayFormat.format(event.date) < today) continue
				if (event.links.some((link) => ownLinks.has(normalize(link)))) continue

				const id = `${dayFormat.format(event.date)}-${slugify(event.title)}`
				if (!store.has(id) && !toAdd.has(id)) toAdd.set(id, event)
			}

			const entries = [...toAdd]
			let failed = 0
			const pages = await Promise.all(
				entries.map(([, event]) =>
					LUMA_PAGE.test(event.link)
						? fetchEventPage(event.link).catch((error) => {
								failed++
								logger.debug(`${event.link}: ${error}`)
								return undefined
							})
						: undefined
				)
			)
			if (failed) logger.warn(`Kunde inte läsa beskrivningen för ${failed} evenemang på Luma`)

			let added = 0
			for (const [i, [id, event]] of entries.entries()) {
				const page = pages[i]
				const onLuma = LUMA_PAGE.test(event.link)
				const intro =
					page?.description ??
					(!onLuma
						? 'Mer information och anmälan finns på arrangörens sida.'
						: page?.online
							? 'Mötet är digitalt. Du får länken när du anmäler dig på Luma.'
							: event.address
								? 'Evenemanget finns i vår kalender på Luma.'
								: 'Evenemanget finns i vår kalender på Luma. Där står det om det är digitalt eller var det hålls, och du får länken eller adressen när du anmäler dig.')
				const body = [intro, event.host && `Värd: ${event.host}.`].filter(Boolean).join('\n\n')
				const data = await parseData({
					id,
					data: {
						title: event.title,
						date: event.date,
						location: event.address || (page?.online ? 'Digitalt' : onLuma ? 'Se Luma' : 'Se arrangörens sida'),
						link: event.link,
						description: page?.description && excerpt(page.description.split('\n')[0], 160)
					}
				})
				store.set({ id, data, body, rendered: { html: textToHtml(body) } })
				added++
			}
			logger.info(`${added} evenemang från Luma`)
		}
	}
}
