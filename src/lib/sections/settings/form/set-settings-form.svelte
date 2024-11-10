<script lang="ts">
	import { browser, dev } from '$app/environment';
	import * as Form from '&/ui/form';
	import type { Snippet } from 'svelte';
	import SuperDebug from 'sveltekit-superforms';
	import type { SuperForm } from 'sveltekit-superforms/client';

	interface Props {
		label: string;
		action: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		form: SuperForm<any>;
		children: Snippet;
	}
	const { label, action, form, children }: Props = $props();

	const { form: formData, enhance, submitting, tainted } = form;
</script>

{#if dev && browser}
	<div class="absolute right-0 p-5">
		<SuperDebug data={$formData} />
	</div>
{/if}

<form method="post" {action} use:enhance class="flex h-full flex-col">
	<h1 class="mb-5 text-3xl font-bold">{label}</h1>

	{@render children()}

	<div class="mt-auto py-5">
		<Form.Button class="w-full" disabled={$submitting || !$tainted}>Save</Form.Button>
	</div>
</form>
