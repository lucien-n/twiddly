<script lang="ts">
	import { setTwiddleSchema, type SetTwiddlechema } from '$lib/schemas/twiddle/set-twiddle';
	import { onSuperFormError } from '$lib/utils/super-form';
	import * as Form from '&/form';
	import { Send } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { Infer, SuperValidated } from 'sveltekit-superforms/client';
	import TwiddleContentField from './fields/twiddle-content-field.svelte';

	interface Props {
		setTwiddleForm: SuperValidated<Infer<SetTwiddlechema>>;
		action: string;
	}
	const { setTwiddleForm, action }: Props = $props();

	const form = superForm(setTwiddleForm, {
		validators: zodClient(setTwiddleSchema),
		onError: onSuperFormError
	});
	const { enhance, submitting, errors } = form;

	const loading = $derived($submitting);
</script>

<form method="post" {action} use:enhance>
	<TwiddleContentField {form} />

	<Form.Errors errors={$errors._errors} />

	<div class="ml-auto mt-2 w-fit">
		<Form.LoadingButton {loading}>
			{#if !loading}
				<Send class="mr-2" />
			{/if}
			<p>Twiddle</p>
		</Form.LoadingButton>
	</div>
</form>
