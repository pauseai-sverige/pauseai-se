// Fällbara rubriker och sidokolumn för sidor, styrt av fälten `fallbara` och
// `sidokolumn` i sidans frontmatter (se content.config.ts och .pages.yml).
//
// Markdown blir en platt lista av rubriker, stycken och listor. Pluginet
// grupperar om dem efter att resten av Markdown-bygget är klart:
//
// - fallbara: 'h2' eller 'h3'. Varje rubrik på den nivån blir en <details> där
//   bara rubriken syns tills läsaren klickar på den.
// - sidokolumn: rubriken på ett avsnitt på nivå 2. Text före första h2 visas
//   överst, avsnitten från första h2 fram till sidokolumnen hamnar i vänster
//   kolumn och sidokolumnen i höger. Det som kommer efter visas under, utan
//   fällbara rubriker. Punkter i sidokolumnen som börjar med fetstil blir
//   fällbara, så att bara den fetstilta meningen syns.

/** @typedef {import('hast').ElementContent} Node */
/** @typedef {import('hast').Element} Element */

/** @param {Node} node */
const headingLevel = (node) =>
	node.type === 'element' && /^h[1-6]$/.test(node.tagName) ? Number(node.tagName[1]) : undefined

/** @param {Node} node @returns {string} */
const text = (node) =>
	node.type === 'text' ? node.value : 'children' in node ? node.children.map(text).join('') : ''

/** @param {string} tagName @param {string[]} className @param {Node[]} children @returns {Element} */
const el = (tagName, className, children) => ({ type: 'element', tagName, properties: className.length ? { className } : {}, children })

/** Gör varje rubrik på nivå `level` till en <details> med texten fram till nästa rubrik på samma eller högre nivå. */
function fold(/** @type {Node[]} */ nodes, /** @type {number} */ level) {
	/** @type {Node[]} */
	const out = []
	for (let i = 0; i < nodes.length; i++) {
		if (headingLevel(nodes[i]) !== level) {
			out.push(nodes[i])
			continue
		}
		let end = i + 1
		while (end < nodes.length && !((headingLevel(nodes[end]) ?? 99) <= level)) end++
		out.push(el('details', ['fallbar'], [el('summary', [], [nodes[i]]), el('div', [], nodes.slice(i + 1, end))]))
		i = end - 1
	}
	return out
}

/**
 * Gör en punkt som börjar med fetstil fällbar. Syns gör den fetstilta texten,
 * och resten av meningen om den är kort, som i "**Verka för ett avtal** i EU och FN."
 */
function foldListItem(/** @type {Element} */ li) {
	const children = li.children.filter((c) => !(c.type === 'text' && !c.value.trim()))
	const [first, next] = children
	if (first?.type !== 'element' || first.tagName !== 'strong') return li
	/** @type {Node[]} */
	const summary = [first]
	let rest = children.slice(1)
	const sentence = next?.type === 'text' ? next.value.match(/^[^.]{1,60}\.(?=\s|$)/) : null
	if (next?.type === 'text' && sentence) {
		summary.push({ type: 'text', value: sentence[0] })
		rest = [{ type: 'text', value: next.value.slice(sentence[0].length) }, ...children.slice(2)]
	}
	if (rest[0]?.type === 'text') rest[0] = { type: 'text', value: rest[0].value.trimStart() }
	if (!rest.map(text).join('').trim()) return li
	return { ...li, children: [el('details', ['punkt'], [el('summary', [], summary), el('p', [], rest)])] }
}

/** @param {Node} node @returns {Node} */
const foldListItems = (node) => {
	if (node.type !== 'element') return node
	if (node.tagName === 'li') return foldListItem(node)
	return { ...node, children: node.children.map(foldListItems) }
}

/** @type {import('satteri').HastPluginEntry} */
export const upplagg = (factory) => {
	const { fallbara, sidokolumn } = /** @type {any} */ (factory.data).astro?.frontmatter ?? {}
	if (!fallbara && !sidokolumn) return null
	const level = fallbara ? Number(String(fallbara).slice(1)) : 0
	const maybeFold = (/** @type {Node[]} */ nodes) => (level ? fold(nodes, level) : nodes)

	return {
		name: 'upplagg',
		after(root, ctx) {
			const nodes = /** @type {Node[]} */ (root.children)
			const h2 = nodes.flatMap((n, i) => (headingLevel(n) === 2 ? [i] : []))
			const side = sidokolumn
				? h2.find((i) => text(nodes[i]).trim().toLowerCase() === String(sidokolumn).trim().toLowerCase())
				: undefined

			if (side === undefined) {
				if (sidokolumn) ctx.report({ message: `Hittar ingen rubrik "${sidokolumn}" för sidokolumnen`, severity: 'warning' })
				ctx.replaceNode(root, { type: 'root', children: maybeFold(nodes) })
				return
			}

			const start = h2[0]
			const end = h2.find((i) => i > side) ?? nodes.length
			const [heading, ...sideBody] = nodes.slice(side, end)
			const columns = el('div', ['kolumner'], [
				el('div', ['kolumn'], maybeFold(nodes.slice(start, side))),
				el('div', ['kolumn', 'sidokolumn'], [heading, ...maybeFold(sideBody).map(foldListItems)])
			])
			ctx.replaceNode(root, {
				type: 'root',
				children: [...nodes.slice(0, start), columns, ...nodes.slice(end)]
			})
		}
	}
}
