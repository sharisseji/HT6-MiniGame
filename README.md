# HT6-MiniGame
Mini Game POC for Hack the 6ixth 2026 Website...

## Game POC

A minimal Proof-of-Concept web game lives in the `game/` folder. It contains a single-screen/menu and a simple canvas-based POC.

Files added:
- `game/index.html` — entry point (open in your browser)
- `game/style.css` — minimal styling
- `game/script.ts` — TypeScript source for the POC
- `game/script.js` — simple compiled JS shim you can run directly
- `game/assets/` — placeholder for images/audio

How to run the POC
- Open `game/index.html` in your browser (double-click or use the editor's "Open in Browser" extension).

Optional: compile the TypeScript source
- If you want to use `script.ts` and maintain a TypeScript workflow, install TypeScript and run `tsc` (or use your bundler):

	1. `npm init -y`
	2. `npm install --save-dev typescript`
	3. `npx tsc --init`
	4. `npx tsc game/script.ts --outDir game`

This will produce a compiled `script.js` in `game/` (or adjust paths in `tsconfig.json`).

# Option A: Open file directly (no server)
`start .\game\index.html`

# Option B: Serve with Python (if installed)
`python -m http.server 8000 --directory .; Start-Process http://localhost:8000/game/index.html`

# Option C: Install a tiny node static server (if you want)
`npm install -g http-server`
`http-server . -p 8000`