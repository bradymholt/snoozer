<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

<svelte:head>
  <title>Snoozer</title>
  <meta name="description" content="Snoozer" />
</svelte:head>

{@render children()}

<style>
</style>
