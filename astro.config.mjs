// @ts-check
import { defineConfig } from 'astro/config'
import { satteri } from '@astrojs/markdown-satteri'
import { upplagg } from './src/upplagg.mjs'

// Förhandsvisningen ligger under /pauseai-se/ på GitHub Pages. När pauseai.se
// pekar hit: sätt site till 'https://pauseai.se' och ta bort base.
const site = 'https://pauseai-sverige.github.io'
const base = '/pauseai-se'

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
	markdown: {
		processor: satteri({ mdastPlugins: [baseLinks], hastPlugins: [upplagg] })
	}
})
