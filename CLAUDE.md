# CLAUDE.md

Guidance for working in this repo.

## Project

Static Svelte + Vite calculator for Pump It Up (PIU) rating/pumbility values.
No backend — see [README.md](README.md) for stack and commands.

## Pumbility calculations

Before touching any pumbility-related logic (level base, grade multipliers,
plate bonuses, passes-needed math) in [src/App.svelte](src/App.svelte), read
[docs/pumbility-formula.md](docs/pumbility-formula.md). It is the source of
truth for the formula, multiplier tables, and worked examples — implementation
should match it exactly. If the formula ever changes, update that doc first,
then bring the code in line with it.
