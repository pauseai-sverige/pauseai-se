// Adresser från den gamla sajten på pauseai.se, som var en kopia av pauseai.info.
// Listan kommer från dess sitemap.xml i oktober 2026. Gamla länkar finns kvar i
// delade inlägg, mejl och sökresultat, så de ska fortsätta fungera.

/** Gamla sidor som har en svensk motsvarighet här. */
const svenska = {
	'/about': '/om-oss',
	'/action': '/engagera-dig',
	'/join': '/engagera-dig',
	'/donate': '/donera',
	'/events': '/evenemang',
	'/proposal': '/forslaget',
	'/protests': '/protester',
	'/risks': '/risker',
	'/xrisk': '/existentiell-risk'
}

/** Övriga gamla sidor. De finns bara på engelska och skickas till samma sida på pauseai.info. */
const globala = [
	'/2023-august-nl', '/2023-july-london-13th', '/2023-july-london-18th', '/2023-july-nyc',
	'/2023-june-london', '/2023-june-london-office-for-ai', '/2023-june-melbourne',
	'/2023-may-deepmind-london', '/2023-november-uk', '/2023-oct', '/2024-february', '/2024-may',
	'/2024-november', '/2024-vacancy-comms-director', '/2024-vacancy-organizing-director',
	'/2025-communications-director', '/2025-february', '/2025-organizing-director',
	'/4-levels-of-ai-regulation', '/ai-takeover', '/ai-x-risk-skepticism', '/australia',
	'/brussels-microsoft-protest', '/building-the-pause-button', '/communication-strategy',
	'/communities', '/community-manager-vacancy', '/counterarguments', '/cybersecurity-risks',
	'/dangerous-capabilities', '/dear-sir-demis-2025', '/deepmind-protest-2025', '/digital-brains',
	'/discord', '/email-builder', '/environmental', '/evaluations', '/feasibility', '/flyering',
	'/funding', '/google-deepmind-broken-promises', '/growth-strategy', '/if-anyone-builds-it-campaign',
	'/incidents', '/learn', '/legal', '/littlehelpers', '/lobby-tips', '/local-organizing',
	'/microgrants', '/mitigating-pause-failures', '/national-groups', '/nyc-action', '/nyc-un-vigil',
	'/offense-defense', '/openai-protest', '/organization', '/organizing-a-protest', '/outcomes',
	'/partnerships', '/pauseai-uk-director', '/pdoom', '/pghflyer', '/policy-director-vacancy',
	'/polls-and-surveys', '/press', '/privacy', '/protesters-code-of-conduct', '/psychology-of-x-risk',
	'/quotes', '/roadmap', '/scenarios', '/sota', '/statement', '/summit', '/tabling', '/teams',
	'/theory-of-change', '/timelines', '/unprotest', '/urgency', '/us-lobby-guide', '/vacancies',
	'/values', '/volunteer-agreement', '/volunteer-stipends', '/volunteer-vacancies', '/welcome',
	'/writing-a-letter', '/writing-press-releases'
]

// /faq fanns på den gamla sajten och finns här med samma adress, så den behöver ingen omdirigering.
export const gamlaAdresser = {
	...svenska,
	...Object.fromEntries(globala.map((path) => [path, `https://pauseai.info${path}`]))
}
