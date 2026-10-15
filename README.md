# PauseAI Sveriges hemsida

Källkoden och texterna till PauseAI Sveriges hemsida. Sajten byggs med [Astro](https://astro.build), redigeras i [Pages CMS](https://app.pagescms.org) och ligger gratis på GitHub Pages.


- **Sajten:** https://pauseai-sverige.github.io/pauseai-se/ (blir pauseai.se när domänen kopplas om)
- **Kontakt:** [sweden@pauseai.info](mailto:sweden@pauseai.info), eller skriv i WhatsApp-gruppen
- **Ansvar:** webbgruppen i PauseAI Sverige. Repot ligger i organisationen [pauseai-sverige](https://github.com/pauseai-sverige) på GitHub.

Vilken dokumentation du behöver beror på vad du ska göra:

| Du vill … | Läs |
| --- | --- |
| lägga upp ett blogginlägg eller ett evenemang | [Lägga upp innehåll](#lägga-upp-innehåll) nedan |
| skriva eller ändra texter om AI-risker och förslaget | [docs/kallor.md](docs/kallor.md): källor, Belagt och ton |
| ändra kod, design eller automatik | [CONTRIBUTING.md](CONTRIBUTING.md) |
| veta vem som har åtkomst, hur ändringar granskas och hur man får eller lämnar åtkomst | [docs/GOVERNANCE.md](docs/GOVERNANCE.md) |

## Lägga upp innehåll

Du behöver inte kunna koda, men du behöver ett gratis konto på [github.com](https://github.com/signup).

### I Pages CMS

1. Be någon i webbgruppen att lägga till dig som medarbetare i repot.
2. Gå till [app.pagescms.org](https://app.pagescms.org) och logga in med GitHub.
3. Välj **pauseai-sverige/pauseai-se**.
4. Välj **Blogg**, **Evenemang**, **Det vi har gjort**, **Berättelser** eller **Sidor** i menyn och klicka på **Add an entry** för att skapa något nytt, eller på en befintlig post för att ändra den.
5. Fyll i fälten. Varje fält har en hjälptext.
6. Klicka **Save**. Ändringen syns på sajten efter ett par minuter.

Bra att veta:

- **Sidan kan visa en gammal version i upp till 10 minuter.** Ladda om med Ctrl+Shift+R (Cmd+Shift+R på Mac). Under fliken [Actions](https://github.com/pauseai-sverige/pauseai-se/actions) ser du när publiceringen är klar.
- **Använd rubriknivå 2 och 3** i texten. Sidans titel är redan rubrik 1.
- **Skriv inte HTML i textfältet.** Redigeraren tar bort det när du sparar. Behöver en sida en knapp finns fälten "Knapp, text" och "Knapp, länk".
- **Bilder** sparas i `public/bilder/`. Använd bara bilder vi har rätt att använda, och fråga alltid personer som syns.
- **Evenemang som har varit** flyttas av sig själva till Tidigare natten efter.
- **Blogg** är för texter från volontärer: debatt, analys och rapporter från det vi gör. Fyll i *Författare* med namnet personen vill synas med, eller lämna tomt för "PauseAI Sverige". Lägg gärna till en bild, eftersom bloggen visar den som omslag. Texter om AI-risker följer [docs/kallor.md](docs/kallor.md).
- **Det vi har gjort** är listan över våra protester, politikermöten, debattartiklar och liknande. Lägg upp något efter varje insats, gärna med en siffra ("ca 30 deltagare"), bilder och länkar till pressbevakning. Skriv bara siffror vi kan stå för.
- **Berättelser** är medlemmars egna ord om varför de engagerar sig. Publicera aldrig en berättelse innan personen har godkänt både texten och hur namnet visas, och ta bort den direkt om personen ber om det. Kryssa i *Visa under Möt oss* för kontaktpersoner som vill synas på startsidan.
- **Allt som sparas syns publikt** och finns kvar i historiken. Skriv aldrig in personuppgifter som telefonnummer eller privata e-postadresser.

### Utan Pages CMS

Den som har ett GitHub-konto men inte är medarbetare kan [föreslå ett evenemang i ett formulär](https://github.com/pauseai-sverige/pauseai-se/issues/new?template=evenemang.yml). Förslaget blir en PR som någon i webbgruppen godkänner.

Har du inget GitHub-konto? Skicka evenemanget i WhatsApp-gruppen eller till [sweden@pauseai.info](mailto:sweden@pauseai.info), så lägger någon upp det.

## Automatik

Det här sköter sig självt med GitHub Actions (`.github/workflows/`):

| Vad | När | Vad du märker |
| --- | --- | --- |
| Publicera sajten | Vid varje ändring och varje natt | Ändringen syns efter ett par minuter. |
| Föreslå ett evenemang | När någon fyller i formuläret | En PR med evenemanget. Slå ihop den för att publicera. |
| Påminnelse inför evenemang | Varje morgon | Ett ärende tre dagar innan, med en lista över var evenemanget ska delas. |
| Kontrollera källor | Måndagar | Ett ärende om ett påstående från [Belagt](docs/kallor.md#belagt) som sajten använder har blivit inaktuellt. |
| Länkkontroll | Den 1:a varje månad | Ett ärende om någon länk har slutat fungera. |
| Veckosammanfattning | Måndagar | Ett ärende med en färdig text till WhatsApp, veckans ändringar och kommande evenemang. |
| Kontrollera ändringen | Vid varje PR | En grön eller röd bock som visar om sajten går att bygga. |
| Dependabot | En gång i månaden | En PR när Astro eller andra delar har nya versioner. |

Vill du få ärendena som mejl? Klicka **Watch → Custom** uppe till höger i repot och bocka i **Issues** och **Pull requests**.

## Ge feedback

Skriv i WhatsApp-gruppen eller [skapa ett ärende](https://github.com/pauseai-sverige/pauseai-se/issues/new) här på GitHub.

## Licens

Texterna delas under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.sv). Många av dem bygger på [PauseAI:s](https://pauseai.info) texter. Se [LICENSE](LICENSE).
