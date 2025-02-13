<script lang="ts">
  import type { PageProps } from "./$types";
  import EventModal from "./EventModal.svelte";

  import checkmark from "$lib/images/checkmark.svg";
  let { data, form }: PageProps = $props();

  let currentActionEventId = $state();
  let currentActionEvent = $derived(data.recentEvents.find((q) => q.id == currentActionEventId));
  let currentActionEventContactAppearances = $derived(
    data.recentEventAppearances.filter((q) => q.eventId == currentActionEventId).map((q) => q.contactId)
  );

  let showEventModal = $state(false);

  function addEvent() {
    form = null;
    currentActionEventId = null;
    showEventModal = true;
  }

  function editEvent(id: number) {
    form = null;
    currentActionEventId = id;
    showEventModal = true;
  }
</script>

<svelte:head>
  <title>Snoozer</title>
  <meta name="description" content="Snoozer" />
</svelte:head>

<main class="container">
  <nav class="tabs">
    <ul>
      <li><a href="/">Contacts</a></li>
      <li class="active">Events</li>
    </ul>
  </nav>
  {#if data.recentEvents.length > 0}
    <table class="striped">
      <thead>
        <tr>
          <th>First</th>
          <th>Last</th>
          {#each data.recentEvents as event}
            <th class="event-header-column">
              <button title={event.description} role="link" onclick={() => editEvent(event.id)}>{event.date}</button>
            </th>
          {/each}
          <th class="actions-column">
            <button onclick={() => addEvent()}>Add New</button>
          </th>
        </tr>
      </thead>
      <tbody>
        {#each data.eventAppearancesByContact as appearances}
          <tr>
            <td>{appearances.contact.first_name}</td>
            <td>{appearances.contact.last_name}</td>
            {#each data.recentEvents as event}
              {#if appearances[event.id.toString()]}
                <td><img src={checkmark} alt="Checkmark" /></td>
              {:else}
                <td></td>
              {/if}
            {/each}
            <td></td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <div class="no-events-placeholder">
      <p>No Events</p>
      <button onclick={() => addEvent()}>Add New</button>
    </div>
  {/if}
</main>

<EventModal
  {form}
  event={currentActionEvent}
  contacts={data.contacts}
  {currentActionEventContactAppearances}
  open={showEventModal}
  closeModal={() => {
    showEventModal = false;
  }}
/>

<style>
  .no-events-placeholder {
    font-size: 1.5rem;
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
</style>
