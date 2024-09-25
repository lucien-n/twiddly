<script lang="ts">
	import { browser } from '$app/environment';
	import * as Form from '&/form';
	import type { Snippet } from 'svelte';
	import SuperDebug from 'sveltekit-superforms';
	import type { SuperForm } from 'sveltekit-superforms/client';

	interface Props {
		label: string;
		action: string;
		form: SuperForm<any>;
		children: Snippet;
	}
	const { label, action, form, children }: Props = $props();

	const { form: formData, enhance, errors, submitting, tainted } = form;
</script>

<form method="post" {action} use:enhance>
	<h1 class="mb-5 text-3xl font-bold">{label}</h1>

	{@render children()}

	<Form.Errors errors={$errors._errors} />

	<Form.Button class="w-full" disabled={$submitting || !$tainted}>Save</Form.Button>

	{#if browser}
		<SuperDebug data={$formData} />
	{/if}
</form>
