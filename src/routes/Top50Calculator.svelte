<script lang="ts">
  import { gradeMultipliers, platesByName, levelBaseFor, pumbilityFor, titleReached, type ChartType } from '../lib/pumbility'
  import { phx2LevelFor } from '../lib/rerates'

  interface ParsedRow {
    difficulty: string
    chartType: ChartType
    levelNumber: number
    phx2LevelNumber: number
    song: string
    grade: string
    plate: string
    levelBase: number
    gradeMult: number
    plateMult: number
    pumbility: number
  }

  let showCalc = false

  interface SkippedRow {
    raw: string[]
    reason: string
  }

  interface Board {
    name: string
    chartType?: ChartType
    rows: ParsedRow[]
  }

  let fileName = ''
  let rows: ParsedRow[] = []
  let skipped: SkippedRow[] = []
  let dragOver = false
  let parseError = ''
  let activeTab = 0

  function top50Of(list: ParsedRow[]): ParsedRow[] {
    return list.slice().sort((a, b) => b.pumbility - a.pumbility).slice(0, 50)
  }

  $: boards = [
    { name: 'Overall Top 50', chartType: undefined, rows: top50Of(rows) },
    { name: 'Singles Top 50', chartType: 'S', rows: top50Of(rows.filter((r) => r.chartType === 'S')) },
    { name: 'Doubles Top 50', chartType: 'D', rows: top50Of(rows.filter((r) => r.chartType === 'D')) },
  ] satisfies Board[]

  function totalOf(board: Board): number {
    return board.rows.reduce((sum, r) => sum + r.pumbility, 0)
  }

  function parseCsvLine(line: string): string[] {
    const result: string[] = []
    let cur = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (inQuotes) {
        if (ch === '"') {
          if (line[i + 1] === '"') {
            cur += '"'
            i++
          } else {
            inQuotes = false
          }
        } else {
          cur += ch
        }
      } else if (ch === '"') {
        inQuotes = true
      } else if (ch === ',') {
        result.push(cur)
        cur = ''
      } else {
        cur += ch
      }
    }
    result.push(cur)
    return result
  }

  function parseCsv(text: string) {
    parseError = ''
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
    if (lines.length === 0) {
      parseError = 'File is empty.'
      rows = []
      skipped = []
      return
    }

    const header = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase())
    const idx = {
      difficulty: header.indexOf('difficulty'),
      song: header.indexOf('song'),
      grade: header.indexOf('lettergrade'),
      plate: header.indexOf('plate'),
    }
    if (idx.difficulty === -1 || idx.song === -1 || idx.grade === -1 || idx.plate === -1) {
      parseError = 'CSV is missing one of the required columns: Difficulty, Song, LetterGrade, Plate.'
      rows = []
      skipped = []
      return
    }

    const newRows: ParsedRow[] = []
    const newSkipped: SkippedRow[] = []

    for (const line of lines.slice(1)) {
      const cols = parseCsvLine(line)
      const difficulty = (cols[idx.difficulty] ?? '').trim()
      const song = (cols[idx.song] ?? '').trim()
      const grade = (cols[idx.grade] ?? '').trim()
      const plate = (cols[idx.plate] ?? '').trim()

      const match = /^([SD])(\d+)$/.exec(difficulty)
      if (!match) {
        newSkipped.push({ raw: cols, reason: `Unsupported chart type "${difficulty}" (not a Single/Double numbered chart)` })
        continue
      }
      const chartType = match[1] as ChartType
      const levelNumber = Number(match[2])

      const gradeMult = gradeMultipliers[grade]
      if (gradeMult === undefined) {
        newSkipped.push({ raw: cols, reason: `Grade "${grade}" is below A+ and doesn't count toward pumbility` })
        continue
      }

      const plateMult = platesByName[plate]?.[chartType]
      if (plateMult === undefined) {
        newSkipped.push({ raw: cols, reason: `Unrecognized plate "${plate}"` })
        continue
      }

      const phx2LevelNumber = phx2LevelFor(song, chartType, levelNumber)
      const levelBase = levelBaseFor(phx2LevelNumber)
      const pumbility = pumbilityFor(phx2LevelNumber, gradeMult, plateMult)

      newRows.push({ difficulty, chartType, levelNumber, phx2LevelNumber, song, grade, plate, levelBase, gradeMult, plateMult, pumbility })
    }

    rows = newRows
    skipped = newSkipped
  }

  function handleFile(file: File) {
    fileName = file.name
    const reader = new FileReader()
    reader.onload = () => parseCsv(String(reader.result ?? ''))
    reader.onerror = () => { parseError = 'Failed to read file.' }
    reader.readAsText(file)
  }

  function onFileInput(e: Event) {
    const file = (e.currentTarget as HTMLInputElement).files?.[0]
    if (file) handleFile(file)
  }

  function onDrop(e: DragEvent) {
    e.preventDefault()
    dragOver = false
    const file = e.dataTransfer?.files?.[0]
    if (file) handleFile(file)
  }
</script>

<main>
  <h1>Top 50 Pumbility Calculator</h1>
  <p class="subtitle">
    This is a calculator for converting your Phoenix 1 scores into a Phoenix 2 Top 50 Pumbility rating. This calculator is built on top of the export from <a href="https://piuscores.arroweclip.se/Account">PIU Scores</a> exported scores csv. To get this file, 1. Make a PIU Scores account 2. Run a score import 3. Go to Account -> Click "DOWNLOAD SCORES". Then, drag the downloaded file below. Note: This calculation is done entirely client side, I will not have access to the file or anything you upload on this site.
  </p>

  <details class="formula">
    <summary>How pumbility is calculated</summary>
    <p>
      <code>levelBase = 130 + 5 * min(level, 24) + 10 * max(0, level - 24)</code><br />
      <code>pumbility = levelBase * (gradeMultiplier + plateMultiplier)</code>
    </p>
    <p>
      Grade multipliers range from 1.35 (A+) to 1.50 (SSS+); plate bonuses range from 0.000 (RG)
      to 0.020 (PG). Your top 50 scores (overall, and per Single/Double) are summed for the total
      pumbility shown below. See the <a href="#/pumbility-calculation">full pumbility calculation reference</a>
      for complete multiplier tables and worked examples.
    </p>
    <p class="disclaimer">
      Disclaimer: Phoenix 2's pumbility formula is not officially documented and has been
      reverse-engineered from community findings. It may be incomplete or out of date as more
      is discovered.
    </p>
  </details>

  <div
    class="dropzone"
    class:dragover={dragOver}
    on:dragover|preventDefault={() => (dragOver = true)}
    on:dragleave={() => (dragOver = false)}
    on:drop={onDrop}
  >
    <p>Drop a CSV file here, or</p>
    <input type="file" accept=".csv,text/csv" on:change={onFileInput} />
    {#if fileName}
      <p class="filename">Loaded: {fileName}</p>
    {/if}
  </div>

  {#if parseError}
    <p class="error">{parseError}</p>
  {/if}

  {#if rows.length > 0}
    {@const board = boards[activeTab]}
    {@const total = totalOf(board)}
    {@const title = board.chartType ? titleReached(board.chartType, total) : undefined}

    <div class="tabs" role="tablist">
      {#each boards as b, i}
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === i}
          class:active={activeTab === i}
          on:click={() => (activeTab = i)}
        >{b.name}</button>
      {/each}
    </div>

    <section>
      <p class="total">
        Total Pumbility (Top {board.rows.length}): <strong>{total.toFixed(2)}</strong>
        {#if board.chartType}
          — Title: <strong>{title ? title[0] : 'None'}</strong>
        {/if}
      </p>

      <label class="calc-toggle">
        <input type="checkbox" bind:checked={showCalc} />
        Show calculation
      </label>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Chart (Phx2)</th>
              <th>Chart (Phx1)</th>
              <th>Song</th>
              <th>Grade</th>
              <th>Plate</th>
              {#if showCalc}
                <th>Calc</th>
              {/if}
              <th>Pumbility</th>
            </tr>
          </thead>
          <tbody>
            {#each board.rows as row, i}
              {@const rerated = row.phx2LevelNumber !== row.levelNumber}
              <tr>
                <td data-label="#">{i + 1}</td>
                <td data-label="Chart (Phx2)" class:rerated>{row.chartType}{String(row.phx2LevelNumber).padStart(2, '0')}</td>
                <td data-label="Chart (Phx1)" class:rerated>{rerated ? row.difficulty : '—'}</td>
                <td data-label="Song">{row.song}</td>
                <td data-label="Grade">{row.grade}</td>
                <td data-label="Plate">{row.plate}</td>
                {#if showCalc}
                  {@const lvl = row.phx2LevelNumber}
                  {@const step1 = Math.min(lvl, 24)}
                  {@const step2 = Math.max(0, lvl - 24)}
                  <td class="calc" data-label="Calc">
                    130 + 5*{step1}{#if step2 > 0} + 10*{step2}{/if} = {row.levelBase}<br />
                    {row.levelBase} * ({row.gradeMult.toFixed(2)} + {row.plateMult.toFixed(3)})
                  </td>
                {/if}
                <td data-label="Pumbility">{row.pumbility.toFixed(2)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>

    {#if skipped.length > 0}
      <details class="skipped">
        <summary>{skipped.length} row(s) skipped (not eligible for pumbility)</summary>
        <ul>
          {#each skipped as { raw, reason }}
            <li>{raw.join(', ')} — {reason}</li>
          {/each}
        </ul>
      </details>
    {/if}
  {/if}
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

  .calc-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.9rem;
    margin: 0.5rem 0;
    cursor: pointer;
  }

  td.calc {
    font-family: monospace;
    font-size: 0.85rem;
    white-space: nowrap;
  }

  .dropzone {
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
    margin: 1.5rem 0;
  }

  .dropzone.dragover {
    border-color: #888;
    background: #f7f7f7;
  }

  .filename {
    color: #555;
    font-size: 0.9rem;
  }

  .error {
    color: #b00;
  }

  .tabs {
    display: flex;
    gap: 0.25rem;
    margin-top: 2rem;
    border-bottom: 1px solid #ccc;
  }

  .tabs button {
    padding: 0.5rem 1rem;
    font-size: 0.95rem;
    background: none;
    border: 1px solid transparent;
    border-bottom: none;
    border-radius: 6px 6px 0 0;
    cursor: pointer;
    color: inherit;
    opacity: 0.7;
  }

  .tabs button:hover {
    opacity: 1;
  }

  .tabs button.active {
    opacity: 1;
    border-color: #ccc;
    background: rgba(128, 128, 128, 0.1);
    margin-bottom: -1px;
    border-bottom: 1px solid transparent;
  }

  section {
    margin-top: 1.5rem;
  }

  .total {
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

  td:nth-child(4) {
    text-align: left;
  }

  td.rerated {
    color: #b00;
    font-weight: 600;
  }

  @media (max-width: 640px) {
    .table-wrap {
      overflow-x: visible;
    }

    table {
      border: none;
    }

    thead {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
    }

    tbody, tr {
      display: block;
    }

    tr {
      border: 1px solid #ccc;
      border-radius: 6px;
      margin-bottom: 0.75rem;
      padding: 0.5rem;
    }

    td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
      border: none;
      border-bottom: 1px solid #eee;
      padding: 0.35rem 0.2rem;
      text-align: right;
    }

    td:last-child {
      border-bottom: none;
    }

    td:nth-child(4) {
      text-align: right;
    }

    td::before {
      content: attr(data-label);
      font-weight: 600;
      color: #666;
      text-align: left;
      margin-right: auto;
    }

    td.calc {
      white-space: normal;
      justify-content: flex-start;
      flex-direction: column;
      align-items: flex-start;
    }

    td.calc::before {
      margin-right: 0;
    }
  }

  .skipped {
    margin-top: 1.5rem;
    color: #666;
    font-size: 0.85rem;
  }

  .skipped ul {
    max-height: 200px;
    overflow-y: auto;
  }
</style>
