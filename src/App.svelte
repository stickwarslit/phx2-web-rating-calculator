<script lang="ts">
  import { route } from './lib/router'
  import Home from './routes/Home.svelte'
  import PumbilityCalculator from './routes/PumbilityCalculator.svelte'
  import Top50Calculator from './routes/Top50Calculator.svelte'
  import PumbilityCalculation from './routes/PumbilityCalculation.svelte'

  const routes: Record<string, typeof Home | typeof PumbilityCalculator | typeof Top50Calculator | typeof PumbilityCalculation> = {
    '/': Home,
    '/pumbility': PumbilityCalculator,
    '/top50': Top50Calculator,
    '/pumbility-calculation': PumbilityCalculation,
  }

  $: page = routes[$route] ?? Home
</script>

<nav>
  <a href="#/">Home</a>
  <a href="#/pumbility">Title Calculator</a>
  <a href="#/top50">Top 50</a>
  <a href="#/pumbility-calculation">Pumbility Docs</a>
</nav>

<svelte:component this={page} />

<style>
  nav {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid #ddd;
    font-family: system-ui, sans-serif;
  }

  nav a {
    font-weight: 600;
  }
</style>
