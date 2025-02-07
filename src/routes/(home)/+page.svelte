<script lang="ts">
	import type { PageProps } from './$types';
	let { data, form }: PageProps = $props();
	import edit from '$lib/images/edit.svg';
	import trashcan from '$lib/images/trashcan.svg';
	import ContactModal from './ContactModal.svelte';
	import ConfirmDeleteModal from './ConfirmDeleteModal.svelte';

	let sortField: string = $state('first_name');
	let sortAsc = $state(true);
	let sortedContacts = $derived(
		data.contacts.toSorted((a: Record<string, any>, b: Record<string, any>) => {
			if (sortAsc) {
				return a[sortField].toString().localeCompare(b[sortField].toString(), 'en', { sensitivity: 'base' });
			} else {
				return b[sortField].toString().localeCompare(a[sortField].toString(), 'en', { sensitivity: 'base' });
			}
		})	
	);

	let currentActionContactId = $state();
	let currentActionContact = $derived(data.contacts.find((q) => q.id == currentActionContactId));

	let showContactModal = $state(false);
	let showDeleteModal = $state(false);

	function addContact() {
		editContact(null);
	}

	function editContact(id: number | null) {
		form = null;
		currentActionContactId = id;
		showContactModal = true;
	}

	function deleteContact(id: number) {
		currentActionContactId = id;
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
				<form method="POST" action="?/logout">
					<button type="submit" role="link">Logout</button>
				</form>
			</li>
		</ul>
	</nav>
</header>
<main class="container">
	<table class="striped">
		<thead>
			<tr>
				<th
					><button class="sort-link" role="link" onclick={() => sort('first_name')}>First</button
					></th
				>
				<th
					><button class="sort-link" role="link" onclick={() => sort('last_name')}>Last</button></th
				>
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
					<td class="actions-column">
						<input type="hidden" name="id" value={contact.id} />
						<button class="edit-button" role="link" onclick={() => editContact(contact.id)}>
							<img class="img-edit" src={edit} alt="Edit" />
						</button>
						<button class="delete-button" role="link" onclick={() => deleteContact(contact.id)}>
							<img class="img-delete" src={trashcan} alt="Delete" />
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	{#if data.contacts.length === 0}
		<div class="no-contacts-placeholder">
			<p>No Contacts</p>
		</div>
	{/if}
</main>

<ContactModal
	{form}
	contact={currentActionContact}
	open={showContactModal}
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
	.actions-column {
		text-align: right;
	}

	td.actions-column button {
		visibility: hidden;
	}

	tr:hover .actions-column button {
		visibility: visible;
	}

	.no-contacts-placeholder {
		font-size: 1.5rem;
		height: 20vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.sort-link {
		text-decoration: none;
		color: initial;
	}
</style>
