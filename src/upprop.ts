// Counts the signatures from Sweden on PauseAI Global's statement when the site is built,
// for the page /upprop. Global keeps the signatures; we only read the public list and store
// nothing. The site rebuilds nightly, so the count is at most a day old.

/** Global's public list of verified signatories, the same one pauseai.info/statement shows. */
export const SIGNATORIES = 'https://pauseai.info/api/signatories'

interface Signatory {
	country?: string
}

/** Signatures whose country is Sweden. Anonymous signatures count too, they just have no name. */
export const countSweden = (json: { signatories: Signatory[] }) =>
	json.signatories.filter((s) => s.country === 'Sweden').length

/** The count, or null if Global does not answer, so the site still builds without it. */
export async function fetchSwedishSignatures(url = SIGNATORIES): Promise<number | null> {
	try {
		const response = await fetch(url, { signal: AbortSignal.timeout(30_000) })
		if (!response.ok) throw new Error(`HTTP ${response.status}`)
		return countSweden(await response.json())
	} catch (error) {
		console.warn(`Kunde inte hämta underskrifter från PauseAI Global: ${error}`)
		return null
	}
}
