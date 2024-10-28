<script lang="ts">
	import { setTwiddleSchema, type SetTwiddlechema } from '$lib/schemas/twiddle/set-twiddle';
	import { handleSuperResult, onSuperFormError } from '$lib/utils/super-form';
	import * as Form from '&/ui/form';
	import { Send } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { Infer, SuperValidated } from 'sveltekit-superforms/client';
	import { getTwiddleState, TwiddleContentField } from '@/twiddle';
	import { toast } from 'svelte-sonner';

	interface Props {
		setTwiddleForm: SuperValidated<Infer<SetTwiddlechema>>;
		action: string;
	}
	const { setTwiddleForm, action }: Props = $props();

	const form = superForm(setTwiddleForm, {
		validators: zodClient(setTwiddleSchema),
		onError: onSuperFormError,
		onResult: (event) =>
			handleSuperResult(event, {
				onFailure: (result) =>
					toast.warning(result.status === 401 ? 'You must be signed-in' : 'An error occured')
			})
	});
	const { enhance, submitting, errors, form: formData } = form;

	const twiddleState = getTwiddleState();

	const loading = $derived($submitting);
	const isComment = $derived(!!setTwiddleForm.data.parentId);
</script>

<form method="post" {action} use:enhance>
	<TwiddleContentField
		{form}
		placeholder={isComment
			? `Share your thoughts on ${twiddleState.data.author.displayName}'s twiddle !`
			: undefined}
	/>

	<Form.Field {form} name="id">
		<Form.Control >
			{#snippet children({ attrs })}
						<input {...attrs} bind:value={$formData.id} hidden />
								{/snippet}
				</Form.Control>
	</Form.Field>

	<Form.Field {form} name="parentId">
		<Form.Control >
			{#snippet children({ attrs })}
						<input {...attrs} bind:value={$formData.parentId} hidden />
								{/snippet}
				</Form.Control>
	</Form.Field>

	<Form.Errors errors={$errors._errors} />

	<div class="ml-auto mt-2 w-fit">
		<Form.LoadingButton {loading}>
			{#if !loading}
				<Send class="mr-2" />
			{/if}
			<p>{isComment ? 'Comment' : 'Twiddle'}</p>
		</Form.LoadingButton>
	</div>
</form>
