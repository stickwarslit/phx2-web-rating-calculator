<details class="formula">
  <summary>How pumbility is calculated</summary>
  <p>
    <code>levelBase = 130 + 5 * min(level, 24) + 10 * max(0, level - 24)</code><br />
    <code>pumbility = levelBase * (gradeMultiplier + plateMultiplier)</code>
  </p>
  <p>
    Grade multipliers range from 1.33 (A) to 1.50 (SSS+); plate bonuses range from -0.010 (RG,
    Single) to 0.020 (PG). <slot />See the <a href="#/pumbility-calculation">full pumbility calculation reference</a>
    for complete multiplier tables and worked examples.
  </p>
  <p class="disclaimer">
    Disclaimer: Phoenix 2's pumbility formula is not officially documented and has been
    reverse-engineered from community findings. It may be incomplete or out of date as more
    is discovered.
  </p>
</details>

<style>
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
</style>
