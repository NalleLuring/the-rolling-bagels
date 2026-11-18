# The Rolling Bagels: webbplats

Statisk sajt i HTML, CSS och JavaScript, utan byggsteg. Byggd efter Figma-filen "Real Food Company",
sektionen "The Rolling Bagels – Final Screens (Mobile + Desktop)".

- Testadress: https://the-rolling-bagels.vercel.app (syns inte på Google)
- Repo: https://github.com/NalleLuring/the-rolling-bagels
- Vercel-projekt: https://vercel.com/nilsandersson-liveses-projects/the-rolling-bagels

Koden låg tidigare i Drive (Rolling Bagels/webbplats). Den mappen är en gammal kopia. Ändra inte där
och lägg inte ut därifrån.

## Så jobbar du

Det som pushas till `main` går ut på testadressen inom någon minut, som i repona för Danderyd,
Cucina och Non Parlo.

Första gången godkänner du inbjudan från GitHub och hämtar repot:
`git clone https://github.com/NalleLuring/the-rolling-bagels.git ~/Developer/the-rolling-bagels`

Varje gång:

1. Hämta det senaste: `git pull`
2. Ändra och titta lokalt: kör `python3 -m http.server 3420` i mappen och öppna http://localhost:3420
3. Spara och lägg ut: `git add -A && git commit -m "Vad du ändrade"` och sedan `git push`

Med Claude Code öppnar du mappen och skriver vad du vill ändra, till exempel "byt bild 3 mot …" eller
"ändra öppettiderna". Säg "pusha" när du är nöjd.

Vill du att något ska vänta innan det går ut kan du pusha till en egen gren i stället:
`git switch -c kajsalisa/kort-beskrivning` och sedan `git push -u origin HEAD`. Vercel bygger då en
förhandsversion, men den länken kräver inloggning i Nils Vercel-team, så visa ändringen lokalt.

Blev något fel kan Nils gå tillbaka till förra versionen under Deployments i Vercel-projektet (Instant
Rollback). Annars rättar du och pushar igen.

## Var saker finns

- `index.html`: all text, menyn, öppettiderna och bildraden högst upp.
- `css/style.css`: färger, typsnitt och layout för mobil och desktop.
- `js/main.js`: arket som glider upp (Meny och Besök oss), loggan som rullar och bildraden.
- `images/bildspel/`: bilderna i bildraden. Kommentaren ovanför bildraden i `index.html` beskriver
  hur en ny bild läggs in. Ge en ändrad bild ett nytt filnamn, eftersom bilderna cachas i en vecka.
- Loggan i `index.html` (blocket med `rb-gap`) är genererad och ska inte ändras för hand. Den byggs
  med skriptet i Drive: Rolling Bagels/design-assets/logo-mask.

## Viktigt

- Repot är publikt. Lägg aldrig lösenord, nycklar eller kunduppgifter här.
- Typsnittet Bouba Round kommer från Adobe Fonts (kit `jgd0smg`). Lägg aldrig typsnittsfiler i repot.
- README.md kommer inte med på sajten (den står i `.vercelignore`).
