<script lang="ts">
  import { titlesByType, platesFor, gradesFor, levelBaseFor, pumbilityFor, type ChartType } from '../lib/pumbility'

  /**
   * Passes needed on a single chart, at a given grade/plate, to reach the
   * target pumbility — assuming all 50 counted scores are this grade/plate.
   * Capped at 50 since only the top 50 chart scores count toward pumbility.
   * '50+' means the raw count exceeds 50 — unreachable via this chart alone.
   * '—' means the chart contributes zero pumbility (RG plate, no bonus) and
   * a raw pass count can't be derived.
   */
  type PassesNeeded = number | '50+' | '—'

  let levelNumber = 23
  let chartType: ChartType = 'D' // affects UG/EG/RG plate and AA/A+/A/B grade multipliers
  let targetPumbility = 18000

  $: titles = titlesByType[chartType]

  $: plates = platesFor(chartType)

  $: grades = gradesFor(chartType)

  $: levelBase = levelBaseFor(levelNumber)

  $: matrix = plates.map(([, plateMult]) =>
    grades.map(([, gradeMult]): PassesNeeded => {
      const p = pumbilityFor(levelNumber, gradeMult, plateMult)
      if (p <= 0) return '—'
      const raw = Math.ceil(targetPumbility / p)
      return raw > 50 ? '50+' : raw
    })
  ) satisfies PassesNeeded[][]

  function handleTitleChange(e: Event) {
    targetPumbility = +(e.currentTarget as HTMLSelectElement).value
  }
</script>

<main>
  <h1>PIU Title Calculator</h1>
  <p class="subtitle">
    Passes needed on a single chart to reach a target pumbility, assuming
    all 50 counted scores are the same grade/plate.
  </p>

  <details class="formula">
    <summary>How pumbility is calculated</summary>
    <p>
      <code>levelBase = 130 + 5 * min(level, 24) + 10 * max(0, level - 24)</code><br />
      <code>pumbility = levelBase * (gradeMultiplier + plateMultiplier)</code>
    </p>
    <p>
      Grade multipliers range from 1.25 (B) to 1.50 (SSS+); plate bonuses range from 0 (RG)
      to 0.020 (PG). See the <a href="#/pumbility-calculation">full pumbility calculation reference</a>
      for complete multiplier tables and worked examples.
    </p>
    <p class="disclaimer">
      Disclaimer: Phoenix 2's pumbility formula is not officially documented and has been
      reverse-engineered from community findings. It may be incomplete or out of date as more
      is discovered.
    </p>
  </details>

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
        on:change={handleTitleChange}
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
              <td
                class:unreachable={matrix[plateIndex][gradeIndex] === '50+'}
                class:zero={matrix[plateIndex][gradeIndex] === '—'}
              >{matrix[plateIndex][gradeIndex]}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <p class="note">
    Note: Pumbility counts your top 50 chart scores. Values above show
    passes needed if this chart is your only source at a given plate/grade.
    "50+" means the target isn't reachable from this chart alone, even at 50
    passes.
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

  .formula {
    margin: 1rem 0;
    font-size: 0.9rem;
    color: #444;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 0.5rem 0.9rem;
  }

  .formula summary {
    cursor: pointer;
    font-weight: 600;
  }

  .formula code {
    background: #f0f0f0;
    padding: 0.1rem 0.3rem;
    border-radius: 4px;
  }

  .disclaimer {
    color: #966400;
    font-style: italic;
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

  td.unreachable {
    color: #b00;
    background: #fdf1f1;
  }

  td.zero {
    color: #aaa;
  }

  .note {
    color: #666;
    font-size: 0.85rem;
    margin-top: 1rem;
  }
</style>
