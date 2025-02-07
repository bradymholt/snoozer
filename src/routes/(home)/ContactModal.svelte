<script>
	import { enhance, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	let { contact, form, open, closeModal } = $props();
	let firstNameInput = $state();
	let dialog = $state();

	$effect(() => {
		if (open) {
			dialog.showModal();
			firstNameInput.focus();
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
				{#if !contact}
					New
				{/if} Contact
			</h2>
		</header>
		<form
			id="contactForm"
			autocomplete="off"
			method="POST"
			action="?/saveContact"
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
				<label for="first_name"
					>First Name
					<input
						type="text"
						autocomplete="off"
						name="first_name"
						value={contact?.first_name}
						aria-invalid={!!form?.errors?.first_name ? true : undefined}
						bind:this={firstNameInput}
						data-1p-ignore
					/>
					{#if form?.errors?.first_name}
						<small>{form?.errors?.first_name?._errors.join(', ')}</small>
					{/if}
				</label>
				<label for="last_name"
					>Last Name
					<input
						type="text"
						name="last_name"
						value={contact?.last_name}
						aria-invalid={!!form?.errors?.last_name ? true : undefined}
					/>
					{#if form?.errors?.last_name}
						<small>{form?.errors?.last_name?._errors.join(', ')}</small>
					{/if}
				</label>
			</fieldset>
			<fieldset class="grid">
				<label for="email"
					>Email
					<input
						type="text"
						name="email"
						value={contact?.email}
						aria-invalid={!!form?.errors?.email ? true : undefined}
					/>
					{#if form?.errors?.email}
						<small>{form?.errors?.email?._errors.join(', ')}</small>
					{/if}
				</label>
				<label for="phone"
					>Phone
					<input
						type="text"
						name="phone"
						placeholder="555-555-5555"
						value={contact?.phone}
						aria-invalid={!!form?.errors?.phone ? true : undefined}
					/>
				</label>
				<label for="birthday"
					>Birthday
					<input
						type="date"
						name="birthday"
						placeholder="01/01/2000"
						value={contact?.birthday}
						aria-invalid={!!form?.errors?.birthday ? true : undefined}
					/>
				</label>
			</fieldset>
			<fieldset>
				<label for="notes"
					>Notes
					<textarea name="notes" rows="2"></textarea>
				</label>
			</fieldset>
			<input type="hidden" name="id" value={contact?.id} />
		</form>
		<footer>
			<button onclick={closeModal} class="secondary"> Cancel </button>
			<button type="submit" form="contactForm">Save</button>
		</footer>
	</article>
</dialog>
