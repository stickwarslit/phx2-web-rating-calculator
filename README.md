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
index.html        entry HTML
src/main.js        mounts the Svelte app
src/App.svelte      root component (currently a placeholder calculator form)
```

## Status

Boilerplate only. The formula in `App.svelte` is a placeholder — actual PIU rating/grade calculations still need to be implemented.
