# Vem gör vad, och regler

Det här styr vem som får göra vad med hemsidans repo. Repot är publikt: alla kan läsa allt, även gammal historik, och alla kan föreslå ändringar.

## Roller

| Roll | Gör | Åtkomst på GitHub | Antal |
| --- | --- | --- | --- |
| **Ägare** | Beslutar om åtkomst, sköter inställningar och säkerhet. | Owner i organisationen | Alltid 2, högst 3 |
| **Kodansvarig** | Granskar och slår ihop ändringar i koden. | Write, teamet `kod` | 1–2, utöver ägarna |
| **Redaktör** | Tar emot texter, kontrollerar dem och publicerar i Pages CMS. | Write, teamet `redaktorer` | 2–3 |
| **Skribent** | Skriver texter och skickar dem till en redaktör. | Ingen | Alla som vill |

Ägarna och vilka som är med i teamen syns under [People](https://github.com/orgs/pauseai-sverige/people) och [Teams](https://github.com/orgs/pauseai-sverige/teams) i organisationen. Fråga i WhatsApp-gruppen om du inte kan se dem.

Skribenter skickar sina texter i WhatsApp-gruppen eller till [sweden@pauseai.info](mailto:sweden@pauseai.info). Texter om AI-risker följer [docs/kallor.md](kallor.md).

## Regler

1. **Det finns alltid två ägare.** Slutar en ägare utses en ny innan den gamla tas bort.
2. **Ingen får mer åtkomst än rollen kräver.** Skribenter behöver ingen åtkomst alls.
3. **Alla med åtkomst har tvåstegsverifiering** på sitt GitHub-konto.
4. **Kod ändras via en PR som någon annan än den som skrev den godkänner.** Slå aldrig ihop en PR med röd bock. Se [CONTRIBUTING.md](../CONTRIBUTING.md).
5. **Redaktörer ändrar bara innehåll**, inte kod.
6. **Redaktören kontrollerar innan något publiceras:** att källorna håller, att den som syns i en text eller på en bild har sagt ja, och att inga personuppgifter kommer med.
7. **Inga lösenord, nycklar eller personuppgifter i repot.** Allt som sparas finns kvar i historiken.
8. **Inga nya appar, tjänster eller tokens med åtkomst till repot** utan att en ägare har sagt ja. Det gäller även AI-agenter. Pages CMS är okej.
9. **Åtkomst som inte används tas bort.** Ägarna går igenom åtkomsten varje kvartal och tar bort den som inte har använt sin på tre månader. Den som vill tillbaka frågar igen.

GitHub kan inte skilja kod från innehåll när någon sparar, så regel 4 och 5 bygger på att vi litar på varandra.

## Få åtkomst

Fråga en ägare i WhatsApp-gruppen. Ägaren frågar:

1. Vad vill du göra? Det avgör om du blir redaktör eller kodansvarig.
2. Vad heter ditt GitHub-konto, och har du tvåstegsverifiering?
3. Har du läst de här reglerna?

En ägare beslutar och berättar det i WhatsApp-gruppen.

## När någon slutar

En ägare tar bort personen från teamet och organisationen, byter ut nycklar som personen har haft tillgång till och noterar det i loggen nedan.

## Om något går fel

- **En nyckel eller ett lösenord har hamnat i repot:** byt ut det direkt hos tjänsten det hör till och säg till en ägare. Det räcker inte att ta bort filen.
- **Du har hittat en säkerhetsbrist:** kontakta en ägare direkt, inte i ett publikt ärende.

## För ägarna: inställningar på GitHub

- [ ] Två ägare i organisationen.
- [ ] Tvåstegsverifiering krävs i organisationen.
- [ ] Teamen `kod` och `redaktorer` finns och har Write. Ingen annan har direkt åtkomst.
- [ ] Ruleset för `main` som blockerar force push och radering.
- [ ] Secret scanning och push protection påslagna.
- [ ] Dependabot alerts och security updates påslagna.
- [ ] Private vulnerability reporting påslaget.
- [ ] Workflow permissions satt till läsbehörighet.
- [ ] Tokens och OAuth-appar kräver godkännande av en ägare.

## Logg

Ändringar i reglerna och kvartalets genomgång av åtkomst.

| Datum | Vad |
| --- | --- |
| 2026-10-15 | Första versionen. |
| 2026-10-17 | Förenklad till fyra roller och nio regler. |
