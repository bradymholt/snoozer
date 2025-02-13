<script>
	let { contact, open, closeModal } = $props();
	const name = $derived(contact?.last_name ? `${contact.last_name}, ${contact.first_name}` : contact?.first_name);
</script>

<dialog {open}>
	<article>
		<header>
			<button onclick={closeModal} aria-label="Close" rel="prev"></button>
			<h2>Confirm Delete</h2>
		</header>
		<p>
			Are you sure you want to delete <strong>{name}</strong>?
		</p>
		<form id="deleteForm" method="POST" action="?/deleteContact">
			<input type="hidden" name="id" value={contact?.id} />
		</form>
		<footer>
			<button onclick={closeModal} class="secondary"> Cancel </button>
			<button type="submit" class="danger" form="deleteForm">Delete</button>
		</footer>
	</article>
</dialog>
