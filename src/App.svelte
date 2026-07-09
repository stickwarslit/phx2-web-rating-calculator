<script>
  const grades = [
    ['SSS+', 1.50], ['SSS', 1.49], ['SS+', 1.48], ['SS', 1.47],
    ['S+', 1.46], ['S', 1.45], ['AAA+', 1.43], ['AAA', 1.41],
    ['AA+', 1.39], ['AA', 1.37], ['A+', 1.35],
  ]

  const titles = [
    ['Advanced Lv. 1', 15000],
    ['Expert Lv. 1', 18000],
  ]

  let levelNumber = 23
  let chartType = 'D' // S or D, only affects UG plate multiplier
  let targetPumbility = 18000

  $: plates = [
    ['PG', 0.020],
    ['UG', chartType === 'D' ? 0.016 : 0.017],
    ['EG', 0.014],
    ['SG', 0.008],
    ['MG', 0.006],
    ['TG', 0.004],
    ['FG', 0.002],
    ['RG', 0.000],
  ]

  $: levelBase = 130 + 5 * Math.min(levelNumber, 24) + 10 * Math.max(0, levelNumber - 24)

  $: matrix = plates.map(([, plateMult]) =>
    grades.map(([, gradeMult]) => {
      const p = levelBase * (gradeMult + plateMult)
      if (p <= 0) return '—'
      return Math.min(Math.ceil(targetPumbility / p), 50)
    })
  )
</script>

<main>
  <h1>PIU Pumbility Calculator</h1>
  <p class="subtitle">
    Passes needed on a single chart to reach a target pumbility, assuming
    all 50 counted scores are the same grade/plate.
  </p>

  <form on:submit|preventDefault>
    <label>
      Chart Level
      <input type="number" min="1" max="28" bind:value={levelNumber} />
    </label>

    <label>
      Chart Type
      <select bind:value={chartType}>
        <option value="S">Single</option>
        <option value="D">Double</option>
      </select>
    </label>

    <label>
      Target Pumbility
      <input type="number" min="0" step="1" bind:value={targetPumbility} />
    </label>

    <div class="title-shortcuts">
      {#each titles as [name, value]}
        <button
          type="button"
          class:active={targetPumbility === value}
          on:click={() => (targetPumbility = value)}
        >
          {name} ({value.toLocaleString()})
        </button>
      {/each}
    </div>
  </form>

  <p class="level-base">Level Base: <strong>{levelBase}</strong></p>

  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Plate \ Grade</th>
          {#each grades as [gradeName]}
            <th>{gradeName}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each plates as [plateName], plateIndex}
          <tr>
            <th>{plateName}</th>
            {#each grades as [gradeName], gradeIndex}
              <td>{matrix[plateIndex][gradeIndex]}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <p class="note">
    Note: Pumbility counts your top 50 chart scores. Values above show
    passes needed if this chart is your only source at a given plate/grade,
    capped at 50.
  </p>
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

  .title-shortcuts {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .title-shortcuts button {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
    cursor: pointer;
    border: 1px solid #999;
    background: #fff;
    border-radius: 4px;
  }

  .title-shortcuts button.active {
    background: #333;
    color: #fff;
    border-color: #333;
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

  .note {
    color: #666;
    font-size: 0.85rem;
    margin-top: 1rem;
  }
</style>
