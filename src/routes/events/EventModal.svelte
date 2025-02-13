<script>
  import { enhance, applyAction } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  let { event, form, contacts, currentActionEventContactAppearances, open, closeModal } = $props();
  let dateInput = $state();
  let dialog = $state();

  $effect(() => {
    if (open) {
      dialog.showModal();
      dateInput.focus();
    } else {
      dialog.close();
    }
  });
</script>

<dialog bind:this={dialog}>
  <article>
    <header>
      <button onclick={closeModal} aria-label="Close" rel="prev"></button>
      <h2>
        {#if !event}
          New
        {/if} Event
      </h2>
    </header>
    <form
      id="touchForm"
      autocomplete="off"
      method="POST"
      action="?/saveEvent"
      use:enhance={() => {
        return async ({ result }) => {
          if (result.status == 204) {
            invalidateAll();
            closeModal();
          }

          applyAction(result);
        };
      }}
    >
      <fieldset class="grid">
        <label for="date"
          >Date
          <input
            type="date"
            name="date"
            value={event?.date ?? ""}
            bind:this={dateInput}
            aria-invalid={!!form?.errors?.date ? true : undefined}
          />
          {#if form?.errors?.date}
            <small>{form?.errors?.date?._errors.join(", ")}</small>
          {/if}
        </label>
      </fieldset>
      <fieldset>
        <label for="description"
          >Description
          <textarea name="description" value={event?.description ?? ""} rows="2"></textarea>
        </label>
      </fieldset>
      <fieldset>
        <select aria-label="Select contacts..." name="contacts[]" multiple size="6">
          <option disabled> Select contacts (cmd/shift click for multi-select)...</option>
          {#each contacts as contact}
            <option value={contact.id} selected={currentActionEventContactAppearances?.includes(contact.id)}>
              {contact.last_name}, {contact.first_name}</option
            >
          {/each}
        </select>
      </fieldset>
      <input type="hidden" name="id" value={event?.id ?? ""} />
    </form>
    <footer>
      <div>
        {#if event}
          <form id="deleteForm" method="POST" action="?/deleteEvent">
            <input type="hidden" name="id" value={event.id} />
            <button type="submit" class="danger" title="Delete">Delete</button>
          </form>
        {/if}
      </div>
      <div>
        <button onclick={closeModal} class="secondary"> Cancel</button>
        <button type="submit" form="touchForm">Save</button>
      </div>
    </footer>
  </article>
</dialog>

<style>
  footer {
    display: flex;
    justify-content: space-between;
  }
</style>
