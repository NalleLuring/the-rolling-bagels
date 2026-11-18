# The Rolling Bagels: webbplats

Statisk sajt i HTML, CSS och JavaScript, utan byggsteg. Byggd efter Figma-filen "Real Food Company",
sektionen "The Rolling Bagels – Final Screens (Mobile + Desktop)".

- Testadress: https://the-rolling-bagels.vercel.app (syns inte på Google)
- Repo: https://github.com/NalleLuring/the-rolling-bagels (privat)
- Vercel-projekt: https://vercel.com/nilsandersson-liveses-projects/the-rolling-bagels

Koden låg tidigare i Drive (Rolling Bagels/webbplats). Den mappen används inte längre.

## Så jobbar du

Det som ligger på `main` är det som syns på testadressen. Varje ändring görs därför i en egen gren och
går ut först när Nils slår ihop den.

Första gången:

1. Godkänn inbjudan till repot. Den kommer som mejl från GitHub.
2. Logga in på GitHub i terminalen med `gh auth login`.
3. Hämta repot: `git clone https://github.com/NalleLuring/the-rolling-bagels.git ~/Developer/the-rolling-bagels`

För varje ändring:

1. Gör en gren: `git switch main && git pull && git switch -c kajsalisa/kort-beskrivning`
2. Ändra och titta lokalt: kör `python3 -m http.server 3420` i mappen och öppna http://localhost:3420
3. Spara och skicka upp: `git add -A && git commit -m "Vad du ändrade"` och sedan `git push -u origin HEAD`
4. Öppna en pull request med länken som visas efter `git push`, och säg till Nils.

Med Claude Code öppnar du mappen och skriver vad du vill ändra, till exempel "byt bild 3 mot …" eller
"ändra öppettiderna". Säg "skicka upp" när du är nöjd, så gör Claude grenen, commiten och pull requesten.

### Det här är väntat

- Vercel bygger ingen förhandsversion av dina grenar. På pull requesten står det att bygget är stoppat
  ("blocked"), eftersom Vercel bara bygger ändringar från medlemmar i Nils Vercel-team. Titta lokalt
  i stället, och tryck inte på "request access".
- Slå inte ihop pull requesten själv. Det gör Nils, och först då går ändringen ut.

## För Nils: publicera

Slå ihop pull requesten på GitHub med Merge pull request, eller be Claude göra det. Vercel lägger ut
`main` på testadressen inom någon minut. Bara vanlig sammanslagning är påslagen i repot. Squash och
rebase behåller Kajsalisa som författare, och då stoppar Vercel bygget.

Blev något fel går det att gå tillbaka till förra versionen under Deployments i Vercel-projektet
(Instant Rollback).

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
- README.md kommer inte med på sajten (den står i `.vercelignore`).
