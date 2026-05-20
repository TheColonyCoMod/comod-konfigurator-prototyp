# CoMod Konfigurator — Prototyp v0.9.11

Interaktiver Konfigurator für CoMod-Modulhäuser. Aufgebaut mit React + Vite + Tailwind.

## Inhalt

Single-Page-Anwendung, die folgende Pfade abbildet:
- Privatkunde (eigenes Grundstück oder Projekt-Beitritt)
- Gewerbekunde (eigene Fläche, Flächensuche selbst oder durch uns)
- Modul-Auswahl mit Familien, Varianten und Stellplatz-Einheiten
- Finanzierung (KfW + GLS für Privat, Plattform-Leasing für Gewerbe)
- Lead-Anfrage mit lokaler Speicherung (Admin-Pipeline-View)

## Deploy auf Vercel — Schritt für Schritt

### Voraussetzungen
- GitHub-Account
- Vercel-Account (gratis, kann sich mit GitHub einloggen)

### 1. GitHub Repository anlegen

1. Gehe auf https://github.com/new
2. Repository Name: `comod-konfigurator-prototyp` (oder anderer Name)
3. **Public** auswählen
4. **Add a README file** anhaken
5. "Create repository"

### 2. Dateien hochladen

Auf der neu erstellten Repo-Seite oben:

1. Klick auf "Add file" → "Upload files"
2. Ziehe **alle Dateien und Ordner** aus diesem ZIP per Drag-and-Drop ins Browser-Fenster
3. WICHTIG: Den `src`-Ordner mit seinen Inhalten so übernehmen wie er ist
4. Unten "Commit changes" klicken

Die Struktur muss am Ende so aussehen:
```
comod-konfigurator-prototyp/
├── .gitignore
├── README.md
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── App.jsx
    ├── index.css
    └── main.jsx
```

### 3. Auf Vercel deployen

1. Gehe auf https://vercel.com
2. "Sign Up" → mit GitHub anmelden (autorisiert Vercel-Zugriff auf Deine Repos)
3. Nach dem Login: "Add New..." → "Project"
4. Such Dein `comod-konfigurator-prototyp` Repo → "Import"
5. Vercel erkennt automatisch: "Framework Preset: Vite" — perfekt, einfach lassen
6. "Deploy" klicken
7. ~2 Minuten warten, bis Build durchgelaufen ist

Du bekommst eine URL wie:
`https://comod-konfigurator-prototyp.vercel.app`

Die kannst Du sofort an Tester schicken.

### 4. Optional: Subdomain konfigurator.comod.haus verknüpfen

1. In Vercel → Dein Projekt → "Settings" → "Domains"
2. "Add Domain" → `konfigurator.comod.haus` eingeben
3. Vercel zeigt einen DNS-Eintrag an, den Du bei Deinem Domain-Hoster (wo comod.haus liegt) hinzufügen musst — meistens ein CNAME-Eintrag
4. Nach 5-15 Minuten DNS-Verbreitung ist die Subdomain aktiv

## Updates deployen

Jede Änderung in `src/App.jsx` (z.B. wenn ich Dir eine neue Version schicke):

1. Auf GitHub: Datei öffnen → Bleistift-Icon (Edit) → Inhalt ersetzen → "Commit changes"
2. Vercel deployt automatisch innerhalb von 1-2 Minuten

## Hinweise zum Prototyp

- **Daten:** Anfragen werden im **Browser** des Testers gespeichert (localStorage). Jeder Tester sieht nur seine eigenen Anfragen im Admin-Bereich. Für zentrale Speicherung wird in der Live-Version Supabase angebunden.
- **Test-Modus:** Es werden keine E-Mails versendet, keine echten Daten übertragen.
- **Admin-Bereich:** Über Settings-Icon oben rechts erreichbar — zeigt eingegangene Test-Anfragen.

## Tech-Stack

- React 18
- Vite 5 (Build-Tool)
- Tailwind CSS 3
- lucide-react (Icons)
- Fraunces + DM Sans (Google Fonts)

## Lokal entwickeln (optional — nicht erforderlich für Deploy)

Falls Node.js installiert ist:
```
npm install
npm run dev
```
