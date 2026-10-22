// Fetches the serving members of the Riksdag from Riksdagen's open data when the site
// is built, for the email tool at /mejla. The site rebuilds nightly, so the list stays
// current without anyone committing email addresses to the repo.

/** Member list, JSON. rdlstatus=tjanst narrows it, but the result still needs filtering. */
export const PERSONLISTA = 'https://data.riksdagen.se/personlista/?rdlstatus=tjanst&utformat=json'

export interface Ledamot {
	id: string
	/** First name, used in the greeting. */
	fornamn: string
	efternamn: string
	parti: string
	valkrets: string
	epost: string
	/** Portrait, 80 px, hosted by Riksdagen. */
	bild: string
}

interface Person {
	intressent_id: string
	tilltalsnamn: string
	efternamn: string
	parti: string
	valkrets: string
	status: string
	bild_url_80: string
	personuppgift?: { uppgift?: { kod: string; uppgift: string[] }[] }
}

/** Turns the API's person list into our shape, keeping only members currently serving. */
export function parsePersonlista(json: { personlista: { person: Person[] } }): Ledamot[] {
	return json.personlista.person
		.filter((p) => /tjänstgörande/i.test(p.status) && p.valkrets)
		.flatMap((p) => {
			const raw = p.personuppgift?.uppgift?.find((u) => u.kod === 'Officiell e-postadress')?.uppgift[0]
			if (!raw) return []
			return [
				{
					id: p.intressent_id,
					fornamn: p.tilltalsnamn,
					efternamn: p.efternamn,
					parti: p.parti,
					valkrets: p.valkrets,
					// Riksdagen writes addresses as namn[på]riksdagen.se to deter spam bots.
					epost: raw.replace('[på]', '@'),
					bild: p.bild_url_80
				}
			]
		})
		.sort((a, b) => a.efternamn.localeCompare(b.efternamn, 'sv') || a.fornamn.localeCompare(b.fornamn, 'sv'))
}

/** Serving members, or an empty list if Riksdagen does not answer, so the site still builds. */
export async function fetchLedamoter(url = PERSONLISTA): Promise<Ledamot[]> {
	try {
		const response = await fetch(url, { signal: AbortSignal.timeout(30_000) })
		if (!response.ok) throw new Error(`HTTP ${response.status}`)
		return parsePersonlista(await response.json())
	} catch (error) {
		console.warn(`Kunde inte hämta riksdagsledamöter: ${error}`)
		return []
	}
}
