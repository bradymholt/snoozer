<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

<svelte:head>
  <title>Snoozer</title>
  <meta name="description" content="Snoozer" />
</svelte:head>

<header class="container">
  <nav>
    <ul>
      <li><h1>Snoozer</h1></li>
    </ul>
    <ul>
      <li>
				<a href="/logout">Logout</a>        
      </li>
    </ul>
  </nav>
</header>
{@render children()}

<style>
</style>
