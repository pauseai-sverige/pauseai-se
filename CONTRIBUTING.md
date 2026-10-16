# Bidra med kod

Det här är för dig som ska ändra kod, design eller automatik. Vill du lägga upp ett blogginlägg eller ett evenemang räcker [README](README.md). Ska du skriva texter, läs [docs/kallor.md](docs/kallor.md).

## Arbetsflöde

- **Innehåll** (blogginlägg, evenemang, sidornas text) ändras i Pages CMS. Det sparas direkt på `main` och publiceras på ett par minuter.
- **Kod** (allt utanför `src/content/`) ändras via en PR:
  1. Skapa en gren från `main`.
  2. Kör `npm run check` och `npm run build` lokalt.
  3. Öppna en PR. Arbetsflödet *Kontrollera ändringen* bygger sajten och ger en grön eller röd bock.
  4. Någon i webbgruppen läser och slår ihop. Slå aldrig ihop en röd PR.
- **Dependabot** öppnar en PR i månaden med nya versioner. Slå bara ihop den när kontrollen är grön. En ny huvudversion kan förstöra bygget, som när TypeScript 7 inte fungerade med `@astrojs/check` (se #10).
- **Commit-meddelanden och PR-beskrivningar** skrivs på svenska och säger *varför*, inte bara vad. De är repots logg över beslut.

Repot är publikt. Lägg aldrig in lösenord, nycklar eller personuppgifter. Hemligheter hör hemma under Settings → Secrets.

## Köra sajten lokalt

Kräver Node.js 24 (se `.nvmrc`).

```sh
npm ci           # installerar exakt de versioner som står i package-lock.json
npm run dev      # förhandsvisning på http://localhost:4321/pauseai-se/
npm run check    # letar efter fel i koden och innehållet
npm run build    # bygger sajten till dist/
npm run preview  # visar det byggda resultatet
```

## Var finns vad?

| Sökväg | Innehåll |
| --- | --- |
| `src/content/blogg/`, `evenemang/`, `sidor/`, `insatser/`, `berattelser/` | Innehållet, en Markdown-fil per post. Redigeras helst i Pages CMS. `insatser` visas på Det vi har gjort och `berattelser` på Därför engagerar vi oss. |
| `src/content.config.ts` | Vilka fält varje sorts innehåll har. Måste stämma med `.pages.yml`. |
| `.pages.yml` | Formulären i Pages CMS: fält, etiketter och hjälptexter. |
| `src/pages/` | Sidmallar. `[slug].astro` visar sidorna, `index.astro` är startsidan, `*.ics.ts` är kalenderfilerna. |
| `src/layouts/Base.astro` | Ramen runt varje sida: `<head>`, meny och sidfot. |
| `src/components/` | Meny, sidfot, logga, evenemangslista och anmälningsformuläret från Global. |
| `src/luma.ts` | Hämtar kommande evenemang från kalendern på Luma när sajten byggs. De som redan finns i `evenemang/` med samma Luma-länk hoppas över. Svarar inte Luma byggs sajten ändå. |
| `src/lib.ts` | Hjälpfunktioner: länkar med `base`, datumformat, menyn, `isUpcoming`, WhatsApp-länkar och kalenderfiler. |
| `src/styles/global.css` | Färger, typsnitt och gemensam stil. |
| `public/` | Filer som publiceras som de är, till exempel favicon och uppladdade bilder. |
| `scripts/` | Skript som arbetsflödena kör. De har inga beroenden och körs med `node`. |
| `.github/workflows/` | Automatiken, se tabellen i README. |
| `.github/ISSUE_TEMPLATE/` | Formuläret "Föreslå ett evenemang". |
| `astro.config.mjs` | Sajtens adress (`site`, `base`) och tillägget som lägger `base` på länkar i Markdown. |
| `src/upplagg.mjs` | Fällbara rubriker och sidokolumn på sidor, styrt av fälten `fallbara`, `sidokolumn` och `oppen`. Används på Förslaget och Risker. |

## Fallgropar

- **Interna länkar ska börja med `/`.** Sajten ligger under `/pauseai-se/` tills domänen kopplas om. I Markdown läggs `base` till automatiskt (`/donera` blir `/pauseai-se/donera`). I `.astro`-filer används `url('/donera')` från `src/lib.ts`. Skriv aldrig `/pauseai-se/` för hand.
- **Tider är svensk tid.** Pages CMS sparar tider utan tidszon, och `content.config.ts` tolkar dem som Europe/Stockholm. Visa datum med `formatDate` och `formatDateTime`, aldrig `toLocaleString()`.
- **Ett evenemang räknas som kommande hela dagen det äger rum** (`isUpcoming`), så att det inte försvinner från listan mitt under evenemanget. Sajten byggs om varje natt så att listan hålls aktuell.
- **HTML i Markdown överlever inte Pages CMS.** Redigeraren gör om HTML till vanlig text eller tar bort det, även kommentarer. Behövs något mer än text, lägg det som ett fält i `content.config.ts` och `.pages.yml`, som knappen på sidorna (`knapp_text`, `knapp_lank`).
- **Fält ändras på två ställen.** Ett nytt fält i `content.config.ts` behöver också läggas till i `.pages.yml`, annars syns det inte i Pages CMS.
- **Bloggen hette Nyheter tidigare.** `src/pages/nyheter/` skickar `/nyheter` och `/nyheter/…` vidare till `/blogg`. Ta inte bort omdirigeringarna, eftersom gamla länkar kan finnas i delade inlägg.
- **Sidan Engagera dig har en egen mall** (`src/pages/engagera-dig.astro`) för att visa anmälningsformuläret, och hoppas därför över i `[slug].astro`.
- **Startsidan hämtar de tre senaste insatserna och berättelserna själv.** Avsnitten Det vi har gjort, Därför engagerar vi oss och Möt oss syns bara när det finns något att visa. Möt oss visar berättelser där *Visa under Möt oss* är ikryssat.
- **Startsidans händelser och citat skrivs in för hand** i `src/pages/index.astro`. Varje post har en kommentar `// Belagt ID` så att källkontrollen hittar den. Se [docs/kallor.md](docs/kallor.md).

## Automatik och inställningar

Arbetsflödena beskrivs i README. Skripten de kör ligger i `scripts/` och kan provas lokalt, till exempel `node scripts/veckosammanfattning.mjs`.

Det här måste vara inställt på GitHub:

- **Settings → Pages → Source: GitHub Actions.**
- **Settings → Actions → General → "Allow GitHub Actions to create and approve pull requests"**, annars kan formuläret för evenemang inte skapa PR:er.
- Schemalagda arbetsflöden stängs av när repot har varit helt inaktivt i 60 dagar. Slå på dem igen under Actions.

Kör ett arbetsflöde för hand: **Actions → välj arbetsflödet i vänsterkolumnen → Run workflow**.

## Felsökning

| Problem | Gör så här |
| --- | --- |
| Ändringen syns inte | Vänta 10 minuter eller ladda om med Ctrl+Shift+R. Kontrollera att *Publicera på GitHub Pages* är grön under Actions. |
| Publiceringen är röd | Öppna körningen och läs felet. Fel vid `npm ci` beror oftast på en uppdatering av ett beroende: gå tillbaka till förra versionen i `package.json` och kör `npm install`. Fel vid bygget beror oftast på en innehållsfil med fel i frontmatter. |
| Ett evenemang syns inte | Kontrollera att datumet är rätt och i framtiden, och att PR:en från formuläret är sammanslagen. |
| Pages CMS hittar inte repot | Du måste vara medarbetare i repot, och Pages CMS måste ha åtkomst (GitHub → Settings → Applications). |

## När pauseai.se ska peka hit

1. Sätt `site` till `'https://pauseai.se'` och `base` till `''` i `astro.config.mjs`.
2. Lägg till filen `public/CNAME` med texten `pauseai.se`.
3. Lägg in omdirigeringar från gamla sökvägar (`/join`, `/proposal`, `/risks`, `/xrisk`, `/faq`, `/donate`, `/action`, `/events`, `/protests`).
4. Be PauseAI Global, som äger domänen, att peka den till GitHub Pages.
5. Slå på **Enforce HTTPS** under Settings → Pages.

Skripten läser adressen från `astro.config.mjs`, så de behöver inte ändras.
