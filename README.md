# খেলাঘর · Khelaghor

A bilingual (Bangla / English) learning-through-play website for homeschooling children aged 1–10.
Skills over speed: no timers, no scores, no rankings. Stickers reward effort.

## Run locally

It is a static site with no build step. Serve the folder with any static server:

```bash
python -m http.server 5173
```

Then open http://localhost:5173. (Opening `index.html` directly also works.)

## Deploy

Upload the whole folder to any static host (Netlify, GitHub Pages, Cloudflare Pages, or a cPanel `public_html`).

## Structure

- `js/core/` — registry, i18n (Bangla digits), storage, speech + tones, DOM helpers
- `js/engines/` — reusable game engines: `quiz`, `explore`, `memory`
- `js/games/` — the 30 games, grouped by age band (`tiny` 1–3, `pre` 3–5, `early` 5–7, `primary` 7–10) plus `activities.js`
- `js/pages/` — home, age band, game player, parent corner, sticker book
- `tests/` — logic tests for every game: `node --test tests/games.test.js`

## Adding a game

Call `KS.registerGame({...})` with `id`, `type` (`quiz` | `explore` | `memory` | `custom`), `bands`, `skill`, `icon`,
and bilingual `title`, `desc` and `tip`. A quiz game only needs `makeRound(ctx, index)` returning plain data;
the tests then check it automatically.

## Notes

- Speech uses the browser's built-in voices. Many devices have no Bangla voice; Bangla is then not read aloud
  (the parent tip says so), and English still works.
- Progress is stored only in the browser (`localStorage`). Nothing is sent anywhere.
