# PIU Rating Calculator

A simple static web page for calculating values related to the rhythm game **Pump It Up** (PIU) — score-based ratings, grades, and similar formulas.

## Stack

- [Svelte](https://svelte.dev/) — UI components/state, compiles to a small static bundle with no runtime framework overhead
- [Vite](https://vitejs.dev/) — dev server and build tool
- No backend — everything runs client-side; the built output is static HTML/CSS/JS deployable anywhere (GitHub Pages, Netlify, etc.)

## Getting started

```bash
npm install
npm run dev      # start local dev server
npm run build     # build static site to dist/
npm run preview   # preview the production build locally
```

## Project structure

```
index.html               entry HTML
src/main.js                mounts the Svelte app
src/App.svelte               root component — nav + hash-based route switch
src/lib/router.ts            minimal hash router (no external dependency)
src/routes/Home.svelte        menu of available calculators
src/routes/PumbilityCalculator.svelte   pumbility calculator (see docs/pumbility-formula.md)
```

Routes are added by dropping a component in `src/routes/` and registering it
in the `routes` map in `App.svelte`. Navigate via `<a href="#/path">` links —
the URL hash drives the current route, so pages are deep-linkable without any
server-side routing config.
