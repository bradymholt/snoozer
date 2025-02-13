<script lang="ts">
  import type { PageProps } from "./$types";
  let { data, form }: PageProps = $props();
  import edit from "$lib/images/edit.svg";

  import ContactModal from "./ContactModal.svelte";
  import ConfirmDeleteModal from "./ConfirmDeleteModal.svelte";

  let sortField: string = $state("first_name");
  let sortAsc = $state(true);
  let sortedContacts = $derived(
    data.contacts.toSorted((a: Record<string, any>, b: Record<string, any>) => {
      if (sortAsc) {
        return a[sortField].toString().localeCompare(b[sortField].toString(), "en", { sensitivity: "base" });
      } else {
        return b[sortField].toString().localeCompare(a[sortField].toString(), "en", { sensitivity: "base" });
      }
    })
  );

  let currentActionContactId = $state();
  let currentActionContact = $derived(data.contacts.find((q) => q.id == currentActionContactId));

  let showContactModal = $state(false);
  let showDeleteModal = $state(false);

  function addContact() {
    form = null;
    currentActionContactId = null;
    showContactModal = true;
  }

  function editContact(id: number | null) {
    form = null;
    currentActionContactId = id;
    showContactModal = true;
  }

  function deleteContact(id: number) {    
    showContactModal = false;
    showDeleteModal = true;
  }

  function sort(field: string) {
    if (sortField === field) {
      sortAsc = !sortAsc;
    } else {
      sortField = field;
      sortAsc = true;
    }
  }
</script>

<main class="container">
  <nav class="tabs">
    <ul>
      <li class="active">Contacts</li>
      <li><a href="/events">Events</a></li>
    </ul>
  </nav>
  {#if data.contacts.length}
    <table class="striped">
      <thead>
        <tr>
          <th><button class="sort-link" role="link" onclick={() => sort("first_name")}>First</button></th>
          <th><button class="sort-link" role="link" onclick={() => sort("last_name")}>Last</button></th>
          <th><button class="sort-link" role="link" onclick={() => sort("email")}>Email</button></th>
          <th><button class="sort-link" role="link" onclick={() => sort("phone")}>Phone</button></th>
          <th class="actions-column">
            <button onclick={() => addContact()}>Add New</button>
          </th>
        </tr>
      </thead>
      <tbody>
        {#each sortedContacts as contact}
          <tr>
            <td>{contact.first_name}</td>
            <td>{contact.last_name}</td>
            <td>{contact.email}</td>
            <td>{contact.phone}</td>
            <td class="actions-column">
              <input type="hidden" name="id" value={contact.id} />
              <button class="edit-button" title="Edit" role="link" onclick={() => editContact(contact.id)}>
                <img src={edit} alt="Edit" />
              </button>          
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <div class="no-contacts-placeholder">
      <p>No Contacts</p>
      <button onclick={() => addContact()}>Add New</button>
    </div>
  {/if}
</main>

<ContactModal
  {form}
  contact={currentActionContact}
  open={showContactModal}
  deleteContact={deleteContact}
  closeModal={() => {
    showContactModal = false;
  }}
/>

<ConfirmDeleteModal
  contact={currentActionContact}
  open={showDeleteModal}
  closeModal={() => {
    showDeleteModal = false;
  }}
/>

<style>
  .no-contacts-placeholder {
    font-size: 1.5rem;
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .sort-link {
    text-decoration: none;
    color: initial;
  }
</style>
