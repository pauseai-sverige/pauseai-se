// Hittar påståenden från Belagt som sajten använder och som behöver ses över:
// de som har passerat sitt bäst före-datum (eller gör det inom 30 dagar) och de som
// har ersatts av en nyare post. Skriver en rapport till kallor.md om något hittas.
//
// Ett påstående räknas som använt om sajten länkar till dess citatlänk (primärkällan
// med citatet markerat), nämner dess id i en kommentar, till exempel "// Belagt SVR-04",
// eller listar det i frontmatter, till exempel "belagt: [BID-04, BID-06]".
//
// Skriver också ut vilka källänkar på sidor med sakpåståenden som inte finns i Belagt.
// De öppnar inget ärende: Belagts veckovisa bevakning läser samma lista och försöker belägga dem.

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
		const id = p.id.replace(/[-]/g, '\\-')
		const byId = new RegExp(`Belagt ${id}\\b`).test(text)
		const byFrontmatter = new RegExp(`^belagt:.*\\b${id}\\b`, 'm').test(text)
		if (byLink || byId || byFrontmatter) used.set(p.id, { ...p, file: used.get(p.id)?.file ?? file })
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

// Source links on pages that make factual claims about AI, minus those Belagt already covers.
// Keep the page and host filters in sync with tools/bevaka.py in pauseai-sverige/belagt.
const claimPages = /^src\/(content\/(laget|blogg)\/|content\/sidor\/(?!engagera-dig|donera|protester|om-oss|upprop)|pages\/(index|mejla)\.astro)/
const notSources = ['pauseai.se', 'pauseai.info', 'lu.ma', 'luma.com', 'github.com', 'github.io', 'youtube.com', 'youtu.be', 'youtube-nocookie.com', 'x.com', 'twitter.com', 'facebook.com', 'instagram.com', 'tiktok.com', 'linkedin.com', 'discord.gg', 'whatsapp.com', 'wikipedia.org', 'archive.org', 'archive.ph', 'google.com', 'creativecommons.org', 'w3.org', 'schema.org', 'goatcounter.com', 'riksdagen.se']
const comparable = (link) =>
	link
		.split('#')[0]
		.replace(/\/$/, '')
		.replace(/^http:/, 'https:')
		.replace('://www.', '://')
		.replace(/(arxiv\.org\/(?:abs|pdf)\/[\d.]+)v\d+$/, '$1')
const covered = new Set(påståenden.map((p) => comparable(p.källa.url)))
const uncovered = new Map()
for (const file of files.filter((f) => claimPages.test(f.replaceAll('\\', '/')))) {
	const text = fs.readFileSync(file, 'utf8')
	for (const raw of text.match(/https?:\/\/[^\s)"'<>\]]+/g) ?? []) {
		const link = raw.replace(/[.,;:]+$/, '')
		const host = new URL(link).hostname.replace(/^www\./, '')
		if (notSources.some((n) => host === n || host.endsWith(`.${n}`))) continue
		if (!covered.has(comparable(link)) && !uncovered.has(comparable(link))) uncovered.set(comparable(link), file)
	}
}
console.log(`${uncovered.size} källänkar på sajten finns inte i Belagt.`)
if (process.env.GITHUB_STEP_SUMMARY) {
	fs.appendFileSync(
		process.env.GITHUB_STEP_SUMMARY,
		[
			`## Källänkar som inte finns i Belagt (${uncovered.size})`,
			'',
			'De kontrolleras inte automatiskt. Belagts bevakning försöker belägga dem varje vecka.',
			'',
			...[...uncovered].map(([link, file]) => `- \`${file}\`: ${link}`),
			''
		].join('\n')
	)
}

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
