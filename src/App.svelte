<script>
  let score = 990000
  let stepArtistLevel = 20

  // Placeholder formula — replace with real PIU rating formula
  $: rating = ((score / 10000) * (stepArtistLevel / 10)).toFixed(2)
</script>

<main>
  <h1>PIU Rating Calculator</h1>

  <form on:submit|preventDefault>
    <label>
      Score
      <input type="number" min="0" max="1000000" bind:value={score} />
    </label>

    <label>
      Step Artist Level
      <input type="number" min="1" max="28" bind:value={stepArtistLevel} />
    </label>
  </form>

  <p class="result">Rating: <strong>{rating}</strong></p>
</main>

<style>
  main {
    max-width: 480px;
    margin: 2rem auto;
    font-family: system-ui, sans-serif;
    padding: 0 1rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1.5rem 0;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.9rem;
  }

  input {
    padding: 0.5rem;
    font-size: 1rem;
  }

  .result {
    font-size: 1.25rem;
  }
</style>
