// Hittar påståenden från Belagt som sajten använder och som behöver ses över:
// de som har passerat sitt bäst före-datum (eller gör det inom 30 dagar) och de som
// har ersatts av en nyare post. Skriver en rapport till kallor.md om något hittas.
//
// Ett påstående räknas som använt om sajten länkar till dess citatlänk (primärkällan
// med citatet markerat) eller nämner dess id i en kommentar, till exempel "// Belagt SVR-04".

import fs from 'node:fs'
import { addDays, stockholmDay, walk } from './lib.mjs'

const response = await fetch('https://pauseai-sverige.github.io/belagt/belagt.json')
if (!response.ok) throw new Error(`Kunde inte hämta Belagt: ${response.status}`)
const { påståenden } = await response.json()

const files = walk('src', ['.md', '.astro', '.ts'])
const used = new Map()
for (const file of files) {
	const text = fs.readFileSync(file, 'utf8')
	for (const p of påståenden) {
		const byLink = p.citatlänk && text.includes(p.citatlänk)
		const byId = new RegExp(`Belagt ${p.id.replace(/[-]/g, '\\-')}\\b`).test(text)
		if (byLink || byId) used.set(p.id, { ...p, file: used.get(p.id)?.file ?? file })
	}
}

const today = stockholmDay(new Date())
const soon = addDays(today, 30)
const problems = [...used.values()]
	.map((p) => {
		if (p.ersatt_av) return { ...p, why: `ersatt av ${p.ersatt_av}` }
		if (p.bäst_före && p.bäst_före < today) return { ...p, why: `bäst före ${p.bäst_före} har passerat` }
		if (p.bäst_före && p.bäst_före <= soon) return { ...p, why: `bäst före ${p.bäst_före}` }
		return null
	})
	.filter(Boolean)

console.log(`Sajten använder ${used.size} påståenden från Belagt, ${problems.length} behöver ses över.`)
if (problems.length) {
	const rows = problems.map(
		(p) => `| [${p.id}](https://pauseai-sverige.github.io/belagt/#${p.id}) | ${p.why} | \`${p.file}\` | ${p.påstående.replace(/\|/g, '/')} |`
	)
	fs.writeFileSync(
		'kallor.md',
		[
			'De här påståendena från Belagt används på sajten och behöver ses över. Kontrollera om uppgiften fortfarande stämmer, och byt eller ta bort den annars.',
			'',
			'| Id | Varför | Fil | Påstående |',
			'| --- | --- | --- | --- |',
			...rows,
			''
		].join('\n')
	)
}
