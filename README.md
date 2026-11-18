# The Rolling Bagels: webbplats

Statisk sajt i HTML, CSS och JavaScript, utan byggsteg. Byggd efter Figma-filen "Real Food Company",
sektionen "The Rolling Bagels – Final Screens (Mobile + Desktop)".

- Testadress: https://the-rolling-bagels.vercel.app (syns inte på Google)
- Vercel-projekt: the-rolling-bagels

## Så jobbar du

1. Hämta repot en gång:
   `git clone https://github.com/NalleLuring/the-rolling-bagels.git ~/Developer/the-rolling-bagels`
2. Gör en egen gren för varje ändring:
   `git switch main && git pull && git switch -c kajsalisa/kort-beskrivning`
3. Titta på sidan lokalt: kör `python3 -m http.server 3420` i mappen och öppna http://localhost:3420
4. Spara och skicka upp:
   `git add -A && git commit -m "Vad du ändrade"` och sedan `git push -u origin HEAD`
5. Säg till när det ska ut. Det som slås ihop till `main` går ut på testadressen, så det görs
   först när Nils har sagt ja.

Med Claude Code öppnar du mappen och skriver vad du vill ändra, till exempel "byt bild 3 mot …" eller
"ändra öppettiderna". Säg "pusha" när du är nöjd, så gör Claude en gren och en pull request åt dig.

## Var saker finns

- `index.html`: all text, menyn, öppettiderna och bildraden högst upp.
- `css/style.css`: färger, typsnitt och layout för mobil och desktop.
- `js/main.js`: arket som glider upp (Meny och Visit us), loggan som rullar och bildraden.
- `images/bildspel/`: bilderna i bildraden. Kommentaren ovanför bildraden i `index.html` beskriver
  hur en ny bild läggs in. Ge en ändrad bild ett nytt filnamn, eftersom bilderna cachas i en vecka.
- Loggan i `index.html` (blocket med `rb-gap`) är genererad och ska inte ändras för hand. Den byggs
  med skriptet i Drive: Rolling Bagels/design-assets/logo-mask.

## Viktigt

- Typsnittet Bouba Round kommer från Adobe Fonts (kit `jgd0smg`). Lägg aldrig typsnittsfiler i repot.
- `main` är det som ligger på testadressen. Jobba alltid i en egen gren.
