<script>
  const grades = [
    ['SSS+', 1.50], ['SSS', 1.49], ['SS+', 1.48], ['SS', 1.47],
    ['S+', 1.46], ['S', 1.45], ['AAA+', 1.43], ['AAA', 1.41],
    ['AA+', 1.39], ['AA', 1.37], ['A+', 1.35],
  ]

  const titlesByType = {
    S: [
      ['Intermediate Lv. 1', 5000], ['Intermediate Lv. 2', 6000], ['Intermediate Lv. 3', 7000],
      ['Intermediate Lv. 4', 8000], ['Intermediate Lv. 5', 9000], ['Intermediate Lv. 6', 10000],
      ['Intermediate Lv. 7', 11000], ['Intermediate Lv. 8', 12000], ['Intermediate Lv. 9', 13000],
      ['Intermediate Lv. 10', 14000],
      ['Advanced Lv. 1', 15000], ['Advanced Lv. 2', 15250], ['Advanced Lv. 3', 15500],
      ['Advanced Lv. 4', 15750], ['Advanced Lv. 5', 16000], ['Advanced Lv. 6', 16250],
      ['Advanced Lv. 7', 16500], ['Advanced Lv. 8', 16750], ['Advanced Lv. 9', 17000],
      ['Advanced Lv. 10', 17250],
      ['Expert Lv. 1', 17500], ['Expert Lv. 2', 17700], ['Expert Lv. 3', 17900],
      ['Expert Lv. 4', 18100], ['Expert Lv. 5', 18300], ['Expert Lv. 6', 18500],
      ['Expert Lv. 7', 18600], ['Expert Lv. 8', 18700], ['Expert Lv. 9', 18800],
      ['Expert Lv. 10', 18900],
      ['Master', 19000],
    ],
    D: [
      ['Intermediate Lv. 1', 5000], ['Intermediate Lv. 2', 6000], ['Intermediate Lv. 3', 7000],
      ['Intermediate Lv. 4', 8000], ['Intermediate Lv. 5', 9000], ['Intermediate Lv. 6', 10000],
      ['Intermediate Lv. 7', 11000], ['Intermediate Lv. 8', 12000], ['Intermediate Lv. 9', 13000],
      ['Intermediate Lv. 10', 14000],
      ['Advanced Lv. 1', 15000], ['Advanced Lv. 2', 15300], ['Advanced Lv. 3', 15600],
      ['Advanced Lv. 4', 15900], ['Advanced Lv. 5', 16200], ['Advanced Lv. 6', 16500],
      ['Advanced Lv. 7', 16800], ['Advanced Lv. 8', 17100], ['Advanced Lv. 9', 17400],
      ['Advanced Lv. 10', 17700],
      ['Expert Lv. 1', 18000], ['Expert Lv. 2', 18200], ['Expert Lv. 3', 18400],
      ['Expert Lv. 4', 18600], ['Expert Lv. 5', 18800], ['Expert Lv. 6', 19000],
      ['Expert Lv. 7', 19100], ['Expert Lv. 8', 19200], ['Expert Lv. 9', 19300],
      ['Expert Lv. 10', 19400],
      ['Master', 19500],
    ],
  }

  let levelNumber = 23
  let chartType = 'D' // S or D, only affects UG plate multiplier
  let targetPumbility = 18000

  $: titles = titlesByType[chartType]

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

    <label>
      Title
      <select
        value={targetPumbility}
        on:change={(e) => (targetPumbility = +e.target.value)}
      >
        {#each titles as [name, value]}
          <option value={value}>{name} ({value.toLocaleString()})</option>
        {/each}
      </select>
    </label>
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
