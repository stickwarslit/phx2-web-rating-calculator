<script lang="ts">
  const calculators = [
    { path: '#/pumbility', name: 'Pumbility Calculator', description: 'Passes needed to reach a target pumbility.' },
  ]
</script>

<main>
  <h1>PIU Rating Calculators</h1>
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
</style>
