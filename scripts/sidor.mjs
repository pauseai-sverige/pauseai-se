// Skriver adressen till varje sida på den publicerade sajten, en per rad.
// Länkkontrollen läser sidorna därifrån, så att även interna länkar som /donera
// kontrolleras på samma sätt som en besökare möter dem.

import fs from 'node:fs'
import { siteUrl } from './lib.mjs'

const site = siteUrl()
const ids = (dir) => fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''))

const paths = [
	'/',
	'/blogg',
	'/evenemang',
	'/vad-vi-har-gjort',
	'/mejla',
	'/berattelser',
	...ids('src/content/sidor').map((id) => `/${id}`),
	...ids('src/content/blogg').map((id) => `/blogg/${id}`),
	...ids('src/content/evenemang').map((id) => `/evenemang/${id}`),
	...ids('src/content/berattelser').map((id) => `/berattelser/${id}`)
]
console.log(paths.map((p) => site + p).join('\n'))
