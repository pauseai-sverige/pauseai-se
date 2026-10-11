# Källor, Belagt och ton

Det här gäller för dig som skriver eller ändrar texter om AI-risker, förslaget och läget i världen. Vår trovärdighet är vår viktigaste tillgång: en journalist eller politiker som hittar ett fel i en siffra slutar lita på resten.

## Regler för källor

1. **Varje sakpåstående har en källa.** Siffror, citat, händelser och vad någon har sagt eller beslutat länkas till där det står.
2. **Länka till primärkällan.** Det är rapporten, forskningsartikeln, myndighetens beslut eller personens egen text, inte en tidning som återger den. Går originalet inte att nå, eller ligger det bakom inloggning (som x.com), får en tidning som återger det duga. Skriv då vem som återger det.
3. **Markera citatet i länken när det går.** En länk som slutar med `#:~:text=…` öppnar sidan med citatet markerat. Belagt har färdiga sådana länkar, se nedan.
4. **Länktexten säger vilken källa det är**, till exempel `([OpenAI](…))` eller `([Centerpartiet](…))`, inte "källa" eller "här".
5. **Skriv vem som påstår något.** När ett företag berättar om sig självt står det "OpenAI uppger", inte att det är ett faktum. Samma sak gäller intresseorganisationer och debattartiklar.
6. **Datera det som åldras.** Skriv "i september 2026" i stället för "nyligen" och "hösten 2026" i stället för "nu".
7. **Döda länkar ersätts med en arkivkopia** från [Wayback Machine](https://web.archive.org), eller med en ny källa. Länkkontrollen hittar dem varje månad.

## Belagt

[Belagt](https://pauseai-sverige.github.io/belagt/) är ett öppet arkiv med påståenden om AI-utvecklingen, på svenska. Varje post har:

- ett påstående
- vem som står bakom det och när
- ett ordagrant citat ur primärkällan, kontrollerat maskinellt
- förbehåll
- ett datum då posten bör ses över (*bäst före*)

Arkivet är neutralt och innehåller också motröster. Det drivs i ett eget repo, [pauseai-sverige/belagt](https://github.com/pauseai-sverige/belagt).

Sajten länkar **inte** till Belagt, utan direkt till primärkällorna. Belagt är verktyget vi hämtar och kontrollerar källorna med.

### Så använder du en post

1. Sök i [Belagt](https://pauseai-sverige.github.io/belagt/) på ett namn, ett ämne eller en siffra.
2. Läs påståendet och förbehållen. Skriv inte mer i texten än vad posten belägger.
3. Klicka på källänken i posten. Den öppnar primärkällan med citatet markerat. Kopiera adressen därifrån, alltså posten `citatlänk` i [belagt.json](https://pauseai-sverige.github.io/belagt/belagt.json), och använd den som länk i texten.
4. I `.astro`-filer, till exempel startsidan, skriver du dessutom en kommentar med postens id, `// Belagt SVR-04`. I Markdown går det inte, eftersom Pages CMS tar bort kommentarer. Där räcker det att länken är postens `citatlänk`.

Länken eller kommentaren gör att arbetsflödet *Kontrollera källor* hittar posten.

### Saknas påståendet i Belagt?

Föreslå det som ett [ärende i Belagt](https://github.com/pauseai-sverige/belagt/issues/new/choose). Du kan också använda en källa direkt på sajten om den följer reglerna ovan, men den kontrolleras då inte automatiskt.

### När källkontrollen öppnar ett ärende

Varje måndag kontrolleras vilka poster från Belagt sajten använder. Om någon har passerat sitt bäst före-datum, gör det inom 30 dagar eller har ersatts av en nyare post, öppnas ärendet **Källor att se över**:

1. Öppna posten i Belagt och läs om den fortfarande stämmer.
2. Har den ersatts, byt till den nya posten.
3. Stämmer den inte längre, skriv om eller ta bort meningen på sajten.
4. Stäng ärendet när allt är åtgärdat.

## Ton och innehåll

- **Påstå inte mer än källorna säger.** Skriv "hundratals AI-forskare och cheferna för de ledande AI-företagen har skrivit under" i stället för "alla experter är överens".
- **Redovisa motröster.** Experterna är oense om hur stor risken är, och det ska synas. Att möta invändningar öppet ger mer trovärdighet än att låtsas att alla håller med. Belagt har motröster under temat *röster* och i poster vars id börjar med BAL-.
- **Skriv för en nyfiken läsare utan förkunskaper.** Använd korta meningar och vanliga ord, och förklara facktermer första gången de förekommer.
- **Skriv på svenska, inte översättningssvenska.** "Paus i träningen av de mest kraftfulla AI-systemen", inte "frontier-modeller".
- **Ny politisk text ska godkännas av webbgruppen** innan den publiceras. Det gäller till exempel vad PauseAI Sverige vill att Sverige ska göra.

## Texter från PauseAI Global

Flera sidor bygger på Globals texter på [pauseai.info](https://pauseai.info), som delas under CC BY 4.0. Därför gäller följande:

- Ange att texten bygger på PauseAI:s. Sidfoten gör det för hela sajten.
- **Förslaget** ska följa Globals [aktuella förslag](https://pauseai.info/proposal). Sidan anger vilken version den bygger på, i dag april 2026. Kontrollera ibland om Global har ändrat sitt förslag.
- Äldre översättningar som Risker, Existentiell risk och FAQ innehåller exempel från 2023–24. De ska uppdateras med svenska och aktuella källor enligt reglerna ovan.
