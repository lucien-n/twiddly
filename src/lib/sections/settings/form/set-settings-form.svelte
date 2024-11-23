<script lang="ts">
	import * as Form from '&/ui/form';
	import type { Snippet } from 'svelte';
	import type { SuperForm } from 'sveltekit-superforms/client';

	interface Props {
		label: string;
		action: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		form: SuperForm<any>;
		children: Snippet;
	}
	const { label, action, form, children }: Props = $props();

	const { enhance, submitting, tainted } = form;
</script>

<form method="post" {action} use:enhance class="flex h-full flex-col px-2">
	<h1 class="mb-5 text-3xl font-bold">{label}</h1>

	{@render children()}

	<div class="mt-auto py-5">
		<Form.Button class="w-full" disabled={$submitting || !$tainted}>Save</Form.Button>
	</div>
</form>
