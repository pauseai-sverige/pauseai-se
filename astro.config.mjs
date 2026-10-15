// @ts-check
import { defineConfig } from 'astro/config'
import { satteri } from '@astrojs/markdown-satteri'
import { upplagg } from './src/upplagg.mjs'
import { gamlaAdresser } from './src/gamla-adresser.mjs'

// Sajten ligger på pauseai.se. base är kvar för att en förhandsvisning under en
// undermapp (t.ex. '/pauseai-se') ska fungera; skripten i scripts/ läser båda härifrån.
const site = 'https://pauseai.se'
const base = ''

/** Lägger till base framför interna länkar och bilder i Markdown (t.ex. /faq). */
const baseLinks = {
	name: 'base-links',
	/** @param {any} node @param {any} ctx */
	link(node, ctx) {
		if (node.url.startsWith('/') && !node.url.startsWith('//')) ctx.setProperty(node, 'url', base + node.url)
	},
	/** @param {any} node @param {any} ctx */
	image(node, ctx) {
		if (node.url.startsWith('/') && !node.url.startsWith('//')) ctx.setProperty(node, 'url', base + node.url)
	}
}

export default defineConfig({
	site,
	base,
	trailingSlash: 'ignore',
	redirects: gamlaAdresser,
	markdown: {
		processor: satteri({ mdastPlugins: [baseLinks], hastPlugins: [upplagg] })
	}
})
