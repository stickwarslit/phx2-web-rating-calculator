<script lang="ts">
  import { gradesFor, platesFor, levelBaseFor, pumbilityFor, type ChartType } from './pumbility'

  let chartType: ChartType = 'S'
  let levelNumber = 1

  $: maxLevel = chartType === 'S' ? 26 : 29
  $: if (levelNumber > maxLevel) levelNumber = maxLevel

  $: levels = Array.from({ length: maxLevel }, (_, i) => i + 1)

  $: plates = platesFor(chartType)

  $: grades = gradesFor(chartType)

  $: levelBase = levelBaseFor(levelNumber, chartType)

  $: matrix = grades.map(([, gradeMult]) =>
    plates.map(([, plateMult]) => pumbilityFor(levelNumber, chartType, gradeMult, plateMult))
  )
</script>

<form on:submit|preventDefault>
  <label>
    Chart Type
    <select bind:value={chartType}>
      <option value="S">Single</option>
      <option value="D">Double</option>
    </select>
  </label>

  <label>
    Chart Level
    <select bind:value={levelNumber}>
      {#each levels as level}
        <option value={level}>{level}</option>
      {/each}
    </select>
  </label>
</form>

<p class="level-base">Level Base: <strong>{levelBase}</strong></p>

<div class="table-wrap">
  <table>
    <thead>
      <tr>
        <th>Grade \ Plate</th>
        {#each plates as [plateName]}
          <th>{plateName}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each grades as [gradeName], gradeIndex}
        <tr>
          <th>{gradeName}</th>
          {#each plates as [plateName], plateIndex}
            <td>{matrix[gradeIndex][plateIndex].toFixed(2)}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  form {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin: 1.5rem 0;
    align-items: flex-end;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.9rem;
  }

  input, select {
    padding: 0.5rem;
    font-size: 1rem;
  }

  .level-base {
    font-size: 1.1rem;
  }

  .table-wrap {
    overflow-x: auto;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    font-size: 0.9rem;
  }

  th, td {
    border: 1px solid #ccc;
    padding: 0.4rem 0.6rem;
    text-align: center;
  }

  thead th {
    background: #f0f0f0;
  }

  tbody th {
    background: #f7f7f7;
    text-align: left;
  }
</style>
