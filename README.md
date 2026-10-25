# MafiaCine — Home tab (React + Google Sheets)

A responsive black-and-red movie catalogue UI based on the provided Home screen reference. This is **step 1 only**: Home UI plus a read-only Google Apps Script endpoint for public catalogue data. Category, History, and Profile are placeholders for later steps.

## Requirements
- Node.js 18+ (20+ recommended)
- Google account (only needed to connect Google Sheets)

## Run locally
```bash
npm install
npm run dev
```
Open the local URL Vite prints, usually `http://localhost:5173`.

## Production build
```bash
npm run build
npm run preview
```

## Connect Google Sheets
Follow `apps-script/SHEET_SETUP.md`. After deploying Apps Script, paste its `/exec` URL into `SCRIPT_URL` in `src/App.jsx`. If left blank, the app uses demo content. A public Apps Script endpoint is suitable only for public catalogue data; don't put private user data or secrets in it.

## Project structure
```text
mafiacine-home/
├── apps-script/
│   ├── Code.gs
│   └── SHEET_SETUP.md
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
└── README.md
```

## Current scope
- Responsive Home screen
- Featured banner and Watch Now action
- Continue Watching progress cards
- Trending cards and genre shortcuts
- Search over displayed demo/sheet movie titles
- Bottom navigation shell for the four tabs
- Read-only Google Apps Script API

Playback opens a provided `watchUrl` only. Add only legal, authorized video URLs. Next step can implement the Category tab.


## Home tab re-check
- Fixed `genres` handling so Google Sheets values like `ACTION,CRIME,DRAMA` are split safely into labels rather than causing a React `.map is not a function` error.
- Added a safe fallback for missing poster URLs.
