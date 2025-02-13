<script lang="ts">  
  let { children } = $props();
</script>

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
