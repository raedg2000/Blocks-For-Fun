# Blocks For Fun

Blocks For Fun is a small browser game I built for fun before the AI era. It is a TypeScript and webpack project inspired by the classic falling-block puzzle formula, with a canvas-based board, next-piece preview, score tracking, sound toggle, pause flow, and on-screen controls.

## What the App Does

- Runs a Tetris-inspired game in the browser.
- Draws the board and pieces on HTML canvas.
- Shows the next piece and current score.
- Includes sound, pause, new game, and about dialogs.
- Uses on-screen buttons for left, down, right, and rotate actions.

## What You Need

- Node.js 20.9 or newer.
- npm that ships with your Node.js installation.
- A modern desktop or mobile browser.

Node.js 20.9+ is recommended because the latest webpack CLI used by this project requires it.

## How To Run

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run start
```

3. Open the local address printed by webpack dev server, which is typically `http://localhost:8080`.

## Build a Production Bundle

```bash
npm run build
```

The production bundle is emitted into the `dist/` folder.

## Notes

- The static HTML, styles, images, and sounds are served from `dist/`.
- The game works in modern browsers and was originally built as a personal for-fun project.

## License

The source code in this repository is licensed under the MIT License. See the `LICENSE` file for the full text.

Some bundled assets and external resources referenced by the app may remain subject to their original licenses or attribution requirements.