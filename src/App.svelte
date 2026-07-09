<script lang="ts">
  import { route } from './lib/router'
  import Home from './routes/Home.svelte'
  import PumbilityCalculator from './routes/PumbilityCalculator.svelte'

  const routes: Record<string, typeof Home | typeof PumbilityCalculator> = {
    '/': Home,
    '/pumbility': PumbilityCalculator,
  }

  $: page = routes[$route] ?? Home
</script>

<nav>
  <a href="#/">Home</a>
  <a href="#/pumbility">Pumbility</a>
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
