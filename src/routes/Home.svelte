<script lang="ts">
  const calculators = [
    { path: '#/pumbility', name: 'Title Calculator', description: 'Passes needed to reach a target pumbility.' },
    { path: '#/top50', name: 'Top 50 Pumbility Calculator', description: 'Upload a scores CSV to compute your top 50 pumbility charts.' },
    { path: '#/pumbility-calculation', name: 'Pumbility Calculation Reference', description: 'Full documentation of the pumbility formula and weighting tables.' },
  ]
</script>

<main>
  <h1>PIU Rating Calculators</h1>
  <p class="subtitle">
    A small collection of calculators for Pump It Up's pumbility/rating system, covering title
    progress, Phoenix 1 &rarr; Phoenix 2 top 50 conversion, and a full formula reference. This
    is a static, client-side-only site — nothing you enter is sent anywhere.
  </p>
  <p class="vibe-coded">
    This repo is <strong>heavily</strong> vibe coded. Expect rough edges, and please
    double-check anything important against in-game values.
  </p>
  <ul>
    {#each calculators as { path, name, description }}
      <li>
        <a href={path}>{name}</a>
        <p>{description}</p>
      </li>
    {/each}
  </ul>
</main>

<style>
  main {
    max-width: 900px;
    margin: 2rem auto;
    font-family: system-ui, sans-serif;
    padding: 0 1rem;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin: 1rem 0;
  }

  a {
    font-size: 1.1rem;
    font-weight: 600;
  }

  p {
    margin: 0.25rem 0 0;
    color: #555;
  }

  .subtitle {
    margin-top: -0.5rem;
  }

  .vibe-coded {
    color: #966400;
    font-style: italic;
    border: 1px solid #e0c060;
    border-radius: 6px;
    padding: 0.5rem 0.9rem;
    background: rgba(224, 192, 96, 0.1);
  }
</style>
