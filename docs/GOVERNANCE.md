# Åtkomst och arbetssätt

Det här dokumentet beskriver vem som har åtkomst till repot, hur ändringar kommer in och vilka regler som gäller. Det riktar sig till alla med åtkomst och till den som ger eller tar bort åtkomst.

Uppgifter som är bekräftade är kontrollerade mot repot och GitHubs API den 15 oktober 2026. Rader som börjar med **TODO** behöver fyllas i av någon som kan se organisationens inställningar.

## 1. Syfte och omfattning

Dokumentet styr repot [pauseai-sverige/pauseai-se](https://github.com/pauseai-sverige/pauseai-se), som innehåller källkoden och texterna till PauseAI Sveriges hemsida. Det gäller:

- vem som har vilken behörighet i repot och i organisationen [pauseai-sverige](https://github.com/pauseai-sverige)
- hur innehåll och kod kommer in på `main`, och därmed ut på sajten
- säkerhet, moderering och hur åtkomst ges, tas bort och ses över

Repot är **publikt**. Alla kan läsa koden och historiken, forka repot, öppna ärenden (issues) och föreslå ändringar med en pull request (PR). Allt som sparas i repot, även i gamla commits, kan läsas av vem som helst.

TODO: Bestäm om dokumentet också ska gälla andra repon i organisationen, till exempel [Belagt](https://pauseai-sverige.github.io/belagt/).

## 2. Roller och team

### Principen om minsta möjliga behörighet

Ge den lägsta roll som räcker för uppgiften, och ta bort åtkomst som inte används. En roll ger alltid allt som rollerna under den ger.

| GitHub-roll | Vad rollen kan i det här repot |
| --- | --- |
| Read | Läsa, klona, öppna ärenden och PR:er från en fork. Det kan alla redan, eftersom repot är publikt. |
| Triage | Som Read, plus sätta etiketter, tilldela, stänga och öppna ärenden och PR:er. Kan inte ändra filer. |
| Write | Som Triage, plus pusha grenar och slå ihop PR:er. **Krävs för att redigera i Pages CMS.** Så länge `main` saknar skydd (avsnitt 4) kan Write också pusha direkt till `main`, vilket publicerar sajten. |
| Maintain | Som Write, plus hantera vissa repoinställningar, till exempel etiketter och Pages. Kan inte ändra åtkomst eller säkerhetsinställningar. |
| Admin | Allt i repot, även åtkomst, rulesets, hemligheter och att radera repot. |

### Nuvarande åtkomst

Enligt GitHubs API har repot tre medarbetare, och inget tyder på att åtkomsten ges via team:

| Team | GitHub-roll | Vem | Ansvar |
| --- | --- | --- | --- |
| Inget team | Admin | [@kanintespela](https://github.com/kanintespela) | TODO: beskriv ansvaret, till exempel inställningar, åtkomst och granskning av kod. |
| Inget team | Write | [@pernillasterner](https://github.com/pernillasterner) | TODO: beskriv ansvaret, till exempel innehåll i Pages CMS. |
| Inget team | Write | [@Samme2351](https://github.com/Samme2351) | TODO: beskriv ansvaret. |

README och CONTRIBUTING talar om **webbgruppen** i PauseAI Sverige som ansvarig för sajten. Webbgruppen finns inte som team på GitHub.

- TODO: Bekräfta under Settings → Collaborators and teams att inga team har åtkomst.
- TODO: Bestäm om ni ska skapa team i organisationen (till exempel ett för innehåll och ett för kod) och ge åtkomst via team i stället för person för person. Skriv in teamen i tabellen när de finns.
- TODO: Skriv vilka som ingår i webbgruppen, eller var listan finns.
- TODO: Kontrollera organisationens grundbehörighet för medlemmar (Organization → Settings → Member privileges → Base permissions). Den bör vara *No permission* eller *Read*.

### Owner i organisationen

TODO: Skriv vilka som är owner i organisationen pauseai-sverige (Organization → People → filtrera på Owner). Det bör vara minst två, så att organisationen inte låses om en person försvinner, men inte fler än nödvändigt.

## 3. Hur ändringar kommer in

Det finns tre vägar in på `main`. Allt som hamnar på `main` publiceras automatiskt på sajten inom ett par minuter.

| Väg | Vem | Hur | Granskning |
| --- | --- | --- | --- |
| Pages CMS | Medarbetare med Write | Innehåll i `src/content/` och bilder i `public/bilder/` sparas **direkt på `main`**, utan PR. | Ingen före publicering. |
| Pull request | Medarbetare (från en gren) och alla andra (från en fork) | Gren från `main`, `npm run check` och `npm run build` lokalt, sedan en PR. Se [CONTRIBUTING.md](../CONTRIBUTING.md). | Någon i webbgruppen läser och slår ihop. Slå aldrig ihop en röd PR. |
| Formuläret "Föreslå ett evenemang" | Alla med GitHub-konto | Ett ärende med formuläret skapar en PR automatiskt (`evenemang-fran-formular.yml`). | Någon i webbgruppen kontrollerar uppgifterna och slår ihop. |

Dependabot öppnar dessutom en PR i månaden med nya versioner. Den slås bara ihop när kontrollen är grön.

### Krav på granskning

CONTRIBUTING.md säger att kod ändras via en PR som någon i webbgruppen läser och slår ihop. Det är en överenskommelse, inte en inställning: GitHub tvingar i dag inte fram vare sig PR eller godkännande (avsnitt 4).

- TODO: Bestäm om en PR måste godkännas av någon annan än den som skrev den, och hur många godkännanden som krävs.
- TODO: Bestäm vad som gäller när bara en person i webbgruppen kan granska kod.

### CODEOWNERS

Det finns ingen `.github/CODEOWNERS`.

- TODO: Bestäm om ni vill ha en. Den kan till exempel kräva granskning av webbgruppen för `.github/`, `scripts/` och `astro.config.mjs`, där ändringar påverkar automatiken och publiceringen. Den kräver ett team eller namngivna personer med Write.

### Automatiska kontroller

| Arbetsflöde | Körs | Kontrollerar |
| --- | --- | --- |
| *Kontrollera ändringen* (`kontrollera.yml`), jobbet `bygg` | Vid varje PR | `npm ci`, `npm run check` och `npm run build`. |

Kontrollen måste i dag inte vara grön för att en PR ska gå att slå ihop. Ändringar som sparas i Pages CMS kontrolleras inte före publicering; ett fel syns först när *Publicera på GitHub Pages* blir röd.

TODO: Bestäm om `bygg` ska vara en obligatorisk statuskontroll (avsnitt 4).

## 4. Regler för main-grenen

**Bekräftat:** GitHubs API visar att `main` inte är skyddad. Ingen branch protection gäller, och det betyder i dag att:

- alla med Write kan pusha direkt till `main`
- ingen PR eller granskning krävs
- ingen statuskontroll krävs
- force push och radering av `main` är inte blockerade

TODO: Bekräfta under Settings → Rules → Rulesets att det inte heller finns några rulesets för repot eller organisationen.

### Det här behöver ni bestämma

Ett krav på PR för hela `main` skulle stoppa Pages CMS, som sparar direkt på `main`. Det finns därför ett val att göra:

- TODO: Välj hur `main` ska skyddas, till exempel:
  - ett ruleset som bara blockerar force push och radering av `main` (påverkar inte Pages CMS), eller
  - ett ruleset som också kräver PR och grön `bygg`, med en undantagslista (bypass) för den roll eller det team som redigerar i Pages CMS, eller
  - att innehåll också ska gå via PR, vilket ändrar arbetssättet för redaktörerna.
- TODO: Skriv in valt ruleset här: namn, vilka grenar det gäller, antal godkännanden, obligatoriska statuskontroller och vilka som finns i undantagslistan.
- TODO: Bestäm om admins ska omfattas av reglerna eller stå på undantagslistan.

## 5. Externa bidragsgivare

Den som inte har åtkomst kan ändå bidra:

1. Forka repot och skapa en gren i din fork.
2. Följ [CONTRIBUTING.md](../CONTRIBUTING.md): kör `npm run check` och `npm run build`, skriv commit-meddelanden och PR-beskrivningar på svenska och förklara *varför*.
3. Öppna en PR mot `main`. *Kontrollera ändringen* körs och någon i webbgruppen granskar.

Texter om AI-risker följer [docs/kallor.md](kallor.md). Evenemang föreslås enklast i [formuläret](https://github.com/pauseai-sverige/pauseai-se/issues/new?template=evenemang.yml).

### Förstagångsbidrag och GitHub Actions

PR:er från forkar kör `kontrollera.yml`, som bara har läsbehörighet (`contents: read`) och inte får tillgång till repots hemligheter.

- TODO: Kontrollera inställningen under Settings → Actions → General → *Approval for running fork pull request workflows from contributors* och skriv in den här. För ett publikt repo rekommenderas minst *Require approval for first-time contributors*.

Formuläret för evenemang är ett undantag: det startas av ett ärende, inte av en PR, och kräver därför aldrig godkännande. Vem som helst med ett GitHub-konto kan alltså få arbetsflödet att skapa en gren och en PR. Ärendets text skickas som miljövariabel och aldrig rakt in i ett kommando, och inget publiceras förrän någon slår ihop PR:en.

## 6. Säkerhet

### Tvåfaktorsautentisering (2FA)

TODO: Kontrollera om organisationen kräver 2FA (Organization → Settings → Authentication security → *Require two-factor authentication*). Det bör vara påslaget för alla med Write eller högre.

### Secret scanning och push protection

TODO: Kontrollera under Settings → Code security att *Secret scanning* och *Push protection* är påslagna. Båda är gratis för publika repon.

### Dependabot

**Bekräftat:** Dependabot version updates är inställt i [`.github/dependabot.yml`](../.github/dependabot.yml). Det öppnar en samlad PR i månaden för npm-paket och för GitHub Actions. Huvudversioner av TypeScript hoppas över tills `@astrojs/check` stöder TypeScript 7.

TODO: Kontrollera att *Dependabot alerts* och *Dependabot security updates* är påslagna under Settings → Code security.

### Behörigheter för GITHUB_TOKEN

**Bekräftat:** Alla arbetsflöden anger sina egna behörigheter med `permissions:`. Bara det som behövs ges:

| Arbetsflöde | Behörigheter |
| --- | --- |
| `kontrollera.yml` | `contents: read` |
| `deploy.yml` | `contents: read`, `pages: write`, `id-token: write` |
| `kontrollera-kallor.yml`, `lankkontroll.yml`, `paminnelser.yml`, `veckosammanfattning.yml` | `contents: read`, `issues: write` |
| `evenemang-fran-formular.yml` | `contents: write`, `pull-requests: write`, `issues: write` |

*Allow GitHub Actions to create and approve pull requests* måste vara påslaget, annars kan formuläret för evenemang inte skapa PR:er (se CONTRIBUTING.md).

- TODO: Kontrollera att standardbehörigheten under Settings → Actions → General → *Workflow permissions* är *Read repository contents and packages permissions*.
- TODO: Bestäm om externa actions ska låsas till en commit-SHA i stället för en version (`actions/checkout@v7`), och vilka actions som är tillåtna under Settings → Actions → General → *Actions permissions*.

### Hemligheter

Repot är publikt. Lägg aldrig in lösenord, nycklar, tokens eller personuppgifter i filer, commit-meddelanden, ärenden eller PR:er. `.env` och `.env.*` ignoreras av git.

Hemligheter hör hemma under Settings → Secrets and variables → Actions. Inget arbetsflöde använder i dag någon egen hemlighet, bara den automatiska `GITHUB_TOKEN`.

Har en hemlighet hamnat i repot: byt ut den direkt hos tjänsten den hör till. Att ta bort filen räcker inte, eftersom den finns kvar i historiken och kan redan ha kopierats.

TODO: Skriv vem som ska kontaktas om en hemlighet har läckt.

### Rapportera sårbarheter

Det finns ingen `SECURITY.md`.

- TODO: Skapa `SECURITY.md` som säger hur man rapporterar en sårbarhet utan att göra den publik, till exempel med *Private vulnerability reporting* (Settings → Code security) eller till en e-postadress.
- TODO: Skriv vem som tar emot rapporterna och hur snabbt de ska besvaras.

## 7. Moderering

### Ärenden och etiketter

Ärenden skapas både av människor och av arbetsflöden. Arbetsflödena skapar sina etiketter själva:

| Etikett | Skapas av | Betyder |
| --- | --- | --- |
| `nytt-evenemang` | `evenemang-fran-formular.yml` | Förslag från formuläret Föreslå ett evenemang. |
| `paminnelse` | `paminnelser.yml` | Påminnelse om att dela ett evenemang om tre dagar. |
| `kallor` | `kontrollera-kallor.yml` | Påståenden från Belagt som behöver ses över. |
| `lankar` | `lankkontroll.yml` | Länkar som har slutat fungera. |
| `veckosammanfattning` | `veckosammanfattning.yml` | Veckans sammanfattning. Stängs direkt. |

- TODO: Skriv vem som går igenom nya ärenden och PR:er, och hur ofta.
- TODO: Bestäm vad som gör att ett ärende stängs utan åtgärd.

### Spam och störande beteende

Spam i formuläret för evenemang blir en PR som inte slås ihop. Stäng ärendet och PR:en och radera grenen `evenemang/arende-<nummer>`.

- TODO: Bestäm vem som får blockera användare från organisationen (Organization → Settings → Moderation → Blocked users) och när det görs.
- TODO: Bestäm när *Interaction limits* (Settings → Moderation options) ska användas, till exempel tillfälligt om repot får mycket spam eller uppmärksamhet.

### Uppförandekod

Det finns ingen uppförandekod i repot.

TODO: Bestäm om ni ska lägga till `CODE_OF_CONDUCT.md`, eller länka till en uppförandekod som PauseAI Sverige eller PauseAI Global redan har.

## 8. Ge och ta bort åtkomst

### Be om åtkomst

Enligt README ber man någon i webbgruppen att läggas till som medarbetare, till exempel i WhatsApp-gruppen eller via [sweden@pauseai.info](mailto:sweden@pauseai.info). Man behöver ett eget GitHub-konto.

- TODO: Skriv vem som beslutar om åtkomst, och om det räcker med en person eller behövs två.
- TODO: Skriv vilken roll som ges för vilket behov. Förslag utifrån avsnitt 2: Triage för den som bara sorterar ärenden, Write för den som redigerar i Pages CMS eller slår ihop PR:er, Admin bara för den som sköter inställningar.
- TODO: Skriv var det noteras vem som har fått åtkomst och varför.

### När någon slutar

1. Ta bort personen från repot (Settings → Collaborators and teams) eller från teamet.
2. Ta bort personen från organisationen om hen inte är med i något annat.
3. Om personen var owner eller admin: kontrollera att minst en annan person har samma behörighet först.
4. Byt ut hemligheter som personen har haft tillgång till.
5. Notera ändringen (se avsnitt 9).

TODO: Bekräfta stegen och skriv vem som ansvarar för att de görs.

## 9. Regelbunden översyn

- TODO: Bestäm hur ofta åtkomsten ses över, till exempel en gång per kvartal.
- TODO: Bestäm vem som gör översynen.
- TODO: Bestäm var den noteras, till exempel som ett ärende med en egen etikett eller i ändringsloggen nedan.

Vid översynen: gå igenom Settings → Collaborators and teams och organisationens People, ta bort den som inte längre behöver åtkomst, sänk roller som är högre än nödvändigt och gå igenom checklistan nedan.

## 10. Ändringslogg

| Datum | Ändring |
| --- | --- |
| 2026-10-15 | Första versionen. Nuläget dokumenterat, öppna frågor markerade med TODO. |

## Checklista för GitHub-inställningar

Ikryssade punkter är bekräftade den 15 oktober 2026.

**Repot**

- [x] Repot är publikt.
- [x] Alla arbetsflöden anger egna, begränsade `permissions:`.
- [x] Dependabot version updates är inställt för npm och GitHub Actions.
- [x] `.env` och `.env.*` ignoreras av git.
- [ ] Ruleset för `main`: blockera force push och radering.
- [ ] Ruleset för `main`: kräv PR, godkännanden och grön `bygg`, med undantag för Pages CMS (se avsnitt 4).
- [ ] Bekräfta att inga andra rulesets finns för repot eller organisationen.
- [ ] `.github/CODEOWNERS` (om ni bestämmer det).
- [ ] `SECURITY.md` och *Private vulnerability reporting*.
- [ ] `CODE_OF_CONDUCT.md` eller en länk till en befintlig uppförandekod.
- [ ] Wiki och Projects avstängda om de inte används (båda är påslagna i dag).

**Code security**

- [ ] Secret scanning påslagen.
- [ ] Push protection påslagen.
- [ ] Dependabot alerts påslagna.
- [ ] Dependabot security updates påslagna.

**Actions**

- [ ] *Workflow permissions*: Read repository contents and packages permissions.
- [ ] *Allow GitHub Actions to create and approve pull requests* påslaget (krävs av formuläret för evenemang).
- [ ] *Approval for running fork pull request workflows*: minst Require approval for first-time contributors.
- [ ] *Actions permissions*: begränsa till GitHub, verifierade skapare och de actions som används.

**Organisationen**

- [ ] 2FA krävs för alla medlemmar.
- [ ] Minst två owners.
- [ ] Grundbehörighet för medlemmar är No permission eller Read.
- [ ] Team skapade och åtkomst given via team (om ni bestämmer det).
- [ ] Ansvariga för moderering och blockering utsedda.
