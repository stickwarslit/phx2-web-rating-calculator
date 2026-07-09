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
  <div class="nav-links">
    <a href="#/">Home</a>
    <a href="#/pumbility">Title Calculator</a>
    <a href="#/top50">Top 50</a>
    <a href="#/pumbility-calculation">Pumbility Docs</a>
  </div>
  <a class="github-link" href="https://github.com/stickwarslit/phx2-web-rating-calculator" target="_blank" rel="noopener noreferrer">GitHub</a>
</nav>

<svelte:component this={page} />

<style>
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid #ddd;
    font-family: system-ui, sans-serif;
  }

  .nav-links {
    display: flex;
    gap: 1rem;
  }

  nav a {
    font-weight: 600;
  }

  .github-link {
    white-space: nowrap;
  }
</style>
