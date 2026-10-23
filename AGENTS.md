# About this repository

This is the website of PauseAI Sverige, https://pauseai.se, the Swedish chapter of the
international grassroots movement [PauseAI](https://pauseai.info). The mission: pause the
training of the most powerful general AI systems, globally, until we know how to build them
safely and keep them under democratic control. Sweden should work for an international
treaty to that end.

Contributors are a mix of developers and non-developers, Swedish speakers and English
speakers. See [Language](#language) for which language goes where.

Read these before working, depending on the task:

| Task | Read |
| --- | --- |
| Code, design, automation | [CONTRIBUTING.md](CONTRIBUTING.md), especially *Fallgropar* |
| Content, blog posts, events | [README.md](README.md), *Lägga upp innehåll* |
| Texts about AI risk, the proposal, claims and sources | [docs/kallor.md](docs/kallor.md) |
| Who may do what, access, security | [docs/GOVERNANCE.md](docs/GOVERNANCE.md) |

# Language

**Public → Swedish. Technical → English. Everything else → either.**

- **Swedish:** everything a visitor or editor sees. Content in `src/content/`, UI strings, URLs and
  slugs, meta tags, Pages CMS labels and help texts, issues the workflows open for editors.
- **English:** everything a developer reads. Identifiers, comments, commit messages, workflow and
  step names, technical docs like this file.
- **Either:** agent conversations, PR descriptions, most issues, README and docs/.

Example: a new field gets an English `name` in `.pages.yml` but a Swedish `label`. A helper is
`formatEventDate()` with an English comment, returning a Swedish string.
Existing Swedish identifiers (`sidor`, `evenemang`, `fallbara`) are tied to URLs and the CMS; keep them.

# Technology and navigation

- **Astro 7**, static site, strict TypeScript. No UI framework, no CSS framework. Two runtime
  dependencies: `astro` and `@astrojs/markdown-satteri`.
- **Node 24** locally (`.nvmrc`). Commands: `npm ci`, `npm run dev`, `npm run check`, `npm run build`.
- **Content** lives in `src/content/<collection>/*.md`, one Markdown file per entry. Collections:
  `sidor` (pages), `blogg`, `evenemang` (events), `insatser` (what we have done), `berattelser` (member stories).
  Schemas in `src/content.config.ts` must match the Pages CMS forms in `.pages.yml`. Change both.
- **Editors use Pages CMS** (app.pagescms.org), which commits straight to `main`. It strips HTML
  from Markdown. Anything beyond plain text becomes a frontmatter field.
- **Templates** in `src/pages/`. `[slug].astro` renders `sidor`, `index.astro` is the start page,
  `*.ics.ts` are calendar feeds. Layout in `src/layouts/Base.astro`, components in `src/components/`.
- **Helpers** in `src/lib.ts`: `url()` for internal links, Swedish date formatting, menu, `isUpcoming`.
- **Luma**: `src/luma.ts` fetches upcoming events from the Luma calendar at build time and merges
  them into `evenemang`. The site rebuilds nightly.
- **Markdown plugins** in `astro.config.mjs` and `src/upplagg.mjs` (collapsible headings, side column).
- **Automation** in `.github/workflows/`, scripts in `scripts/` (plain Node, zero dependencies).
- **Hosting**: GitHub Pages. Domain in `public/CNAME`, DNS at Strato.
- **Time**: Pages CMS stores datetimes without timezone; they are Europe/Stockholm. Use
  `formatDate`/`formatDateTime` from `src/lib.ts`, never `toLocaleString()`.

# Documentation

Check the official docs before writing new code against these. Do not guess APIs from memory;
Astro 7 and Sätteri are recent and differ from older Astro versions.

| Technology | Docs |
| --- | --- |
| Astro | https://docs.astro.build (LLM-friendly index: https://docs.astro.build/llms.txt) |
| Astro content collections and loaders | https://docs.astro.build/en/guides/content-collections/ and https://docs.astro.build/en/reference/content-loader-reference/ |
| Sätteri, the Markdown processor | https://docs.astro.build/en/reference/markdown-processors/satteri/ |
| mdast and hast (syntax trees used by the Markdown plugins) | https://github.com/syntax-tree/mdast and https://github.com/syntax-tree/hast |
| Zod (schemas in `content.config.ts`) | https://zod.dev |
| Pages CMS (`.pages.yml`) | https://pagescms.org/docs/configuration/ (Markdown version: https://pagescms.org/docs/configuration.md) |
| GitHub Actions and `gh` CLI | https://docs.github.com/en/actions and https://cli.github.com/manual/ |
| GitHub Pages custom domains | https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site |
| lychee (link checker) | https://lychee.cli.rs |
| iCalendar (ICS feeds, Luma import) | https://datatracker.ietf.org/doc/html/rfc5545 |

# Common tasks

- **Blog post**: new file `src/content/blogg/YYYY-MM-DD-slug.md` with frontmatter `title`, `date`,
  optional `author`, `description`, `image`. Body in Markdown, headings level 2 and 3. Images go
  in `public/bilder/` and are referenced as `/bilder/name.jpg`.
- **Event**: `src/content/evenemang/YYYY-MM-DD-slug.md` with `title`, `date` (`YYYY-MM-DDTHH:mm`,
  Swedish time), `location`, optional `link`, `description`. Events already on Luma need no file.
- **Page**: `src/content/sidor/slug.md` with `title`, optional `description`, `knapp_text`,
  `knapp_lank`, `fallbara`, `sidokolumn`, `oppen`. Rendered by `[slug].astro` at `/slug`.
  Add it to `menu` in `src/lib.ts` if it belongs in the navigation.
- **Page with custom layout**: own file in `src/pages/`, and exclude the slug in `[slug].astro`
  (see `engagera-dig`).
- **New content field**: add to both `src/content.config.ts` and `.pages.yml`, then use it in the template.
- **Anything else in code**: branch from `main`, run `npm run check` and `npm run build`, open a PR.
  Someone else merges. Never merge a red PR.

# Git

The history is documentation: `git log`, `git blame` and code review all read from it. Adapted
from Chris Beams' [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/).

- **Do not commit or push unless asked.** Leave changes unstaged for the human to review.
- **Small, complete commits.** Each one buildable on its own. Commit more often than feels natural,
  but not one commit per one-liner.
- **One kind of change per commit.** Refactoring and behaviour changes go in separate commits.
- **No commits that cancel each other out** within a PR. Amend, fixup or rebase before pushing.
- **No binaries** except images editors upload to `public/bilder/`. Prefer SVG over PNG/JPG for icons.
- **Subject line:** English, imperative, capitalised, about 50 characters, no period. Says *why*.
  Test: "If applied, this commit will …" followed by the subject.
  Good: `Keep footer at the bottom on short pages`. Bad: `Fixed footer`, `Update Footer.astro`.
  Older commits are in Swedish; do not rewrite them.
- **Body only when the subject cannot carry the why.** Blank line after subject, wrap at 72,
  explain the problem, not the diff. Most commits need no body.
- **PR description in either language**, same rule: why, not how.

# Guidelines

- **Be concise.** Short answers, short diffs, no restating what the user already knows.
- **Read the docs above when touching Astro, Sätteri, Zod or `.pages.yml`.** Verify API shape against the docs, not memory.
- **Verify before claiming done.** `npm run check` and `npm run build` must pass.
- **Do not edit `src/content/` in code PRs.** Content changes go through Pages CMS or a separate PR.
- **Every factual claim about AI needs a primary source.** Follow `docs/kallor.md`. Do not invent
  figures, quotes or dates. Mark claims used from Belagt with a `// Belagt ID` comment.
- **No secrets, no personal data.** The repo is public and history is permanent.
- **No new tools, tokens or agents with repository access** without an owner's approval
  (GOVERNANCE.md, rule 8).
- **Keep redirects.** `src/gamla-adresser.mjs` and `src/pages/nyheter/` protect old links.
- **Internal links start with `/`.** In `.astro` wrap with `url()`; Markdown gets the base automatically.
- **Preserve the minimal stack.** Do not add dependencies, frameworks or build steps without a clear need.
