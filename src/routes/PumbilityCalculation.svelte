<script lang="ts">
  import { gradeNames, gradesByName, plateCodesByName, platesByName, levelBaseFor, phx1GradeBoundaries, phx2GradeBoundaries, type ChartType } from '../lib/pumbility'

  const levelRows = [1, 5, 10, 15, 20, 23, 24, 25, 26, 28].map((level) => ({
    level,
    baseS: levelBaseFor(level, 'S'),
    baseD: levelBaseFor(level, 'D'),
  }))

  const gradeBoundaryRows = phx2GradeBoundaries.slice().reverse()
  const phx1GradeBoundaryRows = phx1GradeBoundaries.slice().reverse()

  const gradeRows = gradeNames.map((name) => ({
    name,
    s: gradesByName[name].S,
    d: gradesByName[name].D,
  }))

  const plateRows = plateCodesByName.map(([code, name]) => ({
    code,
    name,
    s: platesByName[name].S,
    d: platesByName[name].D,
  }))
</script>

<main>
  <h1>Pumbility Calculation Reference</h1>

  <p class="disclaimer">
    Disclaimer: Phoenix 2's pumbility formula is not officially documented and has been
    reverse-engineered from community findings. It may be incomplete or out of date as more is
    discovered.
  </p>

  <section>
    <h2>Overview</h2>
    <p>
      Pumbility is a per-chart score used to determine Advanced/Expert title progress. It is
      drawn from a player's top 50 chart scores (overall, and separately per Single/Double).
      Each counted chart contributes a pumbility value based on its level, the grade achieved,
      and the plate earned.
    </p>
  </section>

  <section>
    <h2>Level Base</h2>
    <p>The base value for a chart, before grade/plate multipliers, scales with chart level:</p>
    <pre><code>levelBase = 130 + 5 * MIN(effectiveLevel, 24) + 10 * MAX(0, effectiveLevel - 24)</code></pre>
    <ul>
      <li>Increments by 5 per level from level 1 up through S23/D24.</li>
      <li>Increments by 10 per level from S24/D25 onward.</li>
      <li>
        <code>effectiveLevel</code> is the chart's numeric level (the number after the S/D
        prefix) for Double charts, or that number + 1 for Single charts — a Single chart uses
        the same base as the Double chart one level higher (e.g. S22 uses the same base as D23).
      </li>
    </ul>

    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Level</th><th>Level Base (S)</th><th>Level Base (D)</th></tr>
        </thead>
        <tbody>
          {#each levelRows as { level, baseS, baseD }}
            <tr><td>{level}</td><td>{baseS}</td><td>{baseD}</td></tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section>
    <h2>Grade Multipliers</h2>
    <p>
      AA, A+, A, and B differ between Single and Double. A+ (Single) and B (both) are guesses
      and not currently confirmed.
    </p>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Grade</th><th>Single</th><th>Double</th></tr>
        </thead>
        <tbody>
          {#each gradeRows as { name, s, d }}
            <tr><td>{name}</td><td>{s.toFixed(2)}</td><td>{d.toFixed(2)}</td></tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section>
    <h2>Letter Grade Boundaries</h2>
    <p>
      Phoenix 2 redrew the 900k-950k grade boundaries: A+/AA/AA+ now span 900-920/920-940/940-950k
      instead of Phoenix 1's single 900k AA cutoff. Everything from AAA (950k) up is unchanged
      from Phoenix 1. Below 900k, scores are graded A (not A+) down to 750k, matching Phoenix 1's
      A tier.
    </p>
    <div class="table-columns">
      <div class="table-wrap">
        <h3>Phoenix 2</h3>
        <table>
          <thead>
            <tr><th>Score</th><th>Grade</th></tr>
          </thead>
          <tbody>
            {#each gradeBoundaryRows as [minScore, name]}
              <tr><td>{minScore.toLocaleString()}</td><td>{name}</td></tr>
            {/each}
          </tbody>
        </table>
      </div>

      <div class="table-wrap">
        <h3>Phoenix 1 (for reference)</h3>
        <table>
          <thead>
            <tr><th>Score</th><th>Grade</th></tr>
          </thead>
          <tbody>
            {#each phx1GradeBoundaryRows as [minScore, name]}
              <tr><td>{minScore === 0 ? 'Below 450,000' : minScore.toLocaleString()}</td><td>{name}</td></tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <section>
    <h2>Plate Bonus Multipliers</h2>
    <p>
      Applied as a bonus added on top of the grade-multiplied base (see formula below). Ultimate
      Game (UG) has separate values for Single vs Double charts.
    </p>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Plate</th><th>Name</th><th>Single</th><th>Double</th></tr>
        </thead>
        <tbody>
          {#each plateRows as { code, name, s, d }}
            <tr><td>{code}</td><td>{name}</td><td>{s.toFixed(3)}</td><td>{d.toFixed(3)}</td></tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section>
    <h2>Pumbility Formula</h2>
    <pre><code>pumbility = levelBase * gradeMultiplier + levelBase * plateMultiplier
          = levelBase * (gradeMultiplier + plateMultiplier)</code></pre>
  </section>

  <section>
    <h2>Worked Examples</h2>

    <h3>SSS+ PG on D16</h3>
    <pre><code>levelBase  = 130 + 5*16   = 210
gradeBonus = 210 * 1.5    = 315
plateBonus = 210 * 0.02   = 4.2
pumbility  = 315 + 4.2    = 319.2</code></pre>

    <h3>SSS+ UG on S24</h3>
    <p class="note">
      The 5-per-level increment applies through level 24 (S23/D24), and the 10-per-level
      increment begins at level 25 (S24/D25) — independent of Single/Double. So an S24 chart's
      level base uses one 10-point step above the level-24 base.
    </p>
    <pre><code>levelBase  = 130 + 5*24 + 10*1 = 260
gradeBonus = 260 * 1.5          = 390
plateBonus = 260 * 0.017        = 4.42
pumbility  = 390 + 4.42         = 394.42</code></pre>
  </section>

  <section>
    <h2>Passes Needed for a Target Pumbility</h2>
    <p>
      Assuming all 50 counted charts are the same level/grade/plate (worst case / raw-pass
      estimate):
    </p>
    <pre><code>passesNeeded = CEILING(targetPumbility / pumbility, 1)</code></pre>
    <p>Capped at 50, since only the top 50 chart scores count toward pumbility.</p>

    <h3>Example — raw RG A+ passes on D20 for Advanced Lv. 1 (15,000 pumbility)</h3>
    <pre><code>levelBase  = 130 + 5*20 = 230
pumbility  = 230 * (1.35 + 0) = 310.5
passes     = CEILING(15000 / 310.5) = 49  -&gt; capped at 50 (all D20 charts)</code></pre>
  </section>
</main>

<style>
  main {
    max-width: 900px;
    margin: 2rem auto;
    font-family: system-ui, sans-serif;
    padding: 0 1rem;
  }

  .disclaimer {
    color: #966400;
    font-style: italic;
    border: 1px solid #e0c060;
    border-radius: 6px;
    padding: 0.5rem 0.9rem;
    background: rgba(224, 192, 96, 0.1);
  }

  section {
    margin-top: 2rem;
  }

  h2 {
    border-bottom: 1px solid #ddd;
    padding-bottom: 0.25rem;
  }

  h3 {
    margin-bottom: 0.25rem;
  }

  pre {
    background: #f0f0f0;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 0.9rem;
  }

  code {
    font-family: 'SFMono-Regular', Consolas, monospace;
  }

  .note {
    color: #555;
    font-size: 0.9rem;
  }

  .table-wrap {
    overflow-x: auto;
  }

  .table-columns {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-top: 0.5rem;
  }

  .table-columns .table-wrap {
    flex: 1 1 220px;
    margin-top: 0;
  }

  .table-columns h3 {
    margin-bottom: 0.25rem;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }

  th, td {
    border: 1px solid #ccc;
    padding: 0.4rem 0.6rem;
    text-align: center;
  }

  thead th {
    background: #f0f0f0;
  }
</style>
