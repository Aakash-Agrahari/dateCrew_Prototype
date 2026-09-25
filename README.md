# The Date Crew - Preference Gate (prototype)
Node/Express (ES modules) API + React (Vite) UI. Mocked data lives in `server/data.js`.

## Run
```
npm run install:all
cp server/.env.example server/.env   # optional: add GEMINI_API_KEY for Gemini parsing
npm run server     # terminal 1 -> http://localhost:3001
npm run client     # terminal 2 -> http://localhost:5173
```
Without an API key, feedback parsing uses a keyword fallback. Everything else is deterministic.

## Core idea
- `server/checker.js`  hard-constraint check of profile vs stated preferences
- `server/parser.js`   free-text rejection -> structured reasons, plus "preventable?" flag
