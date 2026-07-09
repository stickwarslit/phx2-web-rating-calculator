<script lang="ts">
  import PumbilityFormula from '../lib/PumbilityFormula.svelte'
  import ChartCalculatorTable from '../lib/ChartCalculatorTable.svelte'
</script>

<main>
  <h1>PIU Chart Calculator</h1>
  <p class="subtitle">
    Pumbility rating for every grade/plate combination on a single chart.
  </p>

  <PumbilityFormula />

  <ChartCalculatorTable />
</main>

<style>
  main {
    max-width: 900px;
    margin: 2rem auto;
    font-family: system-ui, sans-serif;
    padding: 0 1rem;
  }

  .subtitle {
    color: #555;
    margin-top: -0.5rem;
  }
</style>
