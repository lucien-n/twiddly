<script lang="ts">
	import { getTwiddleState, TwiddleContentField } from '#/twiddle';
	import { setTwiddleSchema, type SetTwiddlechema } from '$lib/schemas/twiddle/set-twiddle';
	import { handleSuperResult, onSuperFormError } from '$lib/utils/super-form';
	import { TooltippedProgressCircle } from '&/progress';
	import * as Form from '&/ui/form';
	import { getSanitizedContentLength, sanitizeTwiddleContent } from '$lib/utils/helpers';
	import { Send } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { Infer, SuperValidated } from 'sveltekit-superforms/client';
	import { MAX_CONTENT_LENGTH } from '$lib/schemas/twiddle/fields';

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
	const sanitizedContentLength = $derived(
		getSanitizedContentLength(sanitizeTwiddleContent($formData.content))
	);
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
		<Form.Control>
			{#snippet children({ props })}
				<input {...props} bind:value={$formData.id} hidden />
			{/snippet}
		</Form.Control>
	</Form.Field>

	<Form.Field {form} name="parentId">
		<Form.Control>
			{#snippet children({ props })}
				<input {...props} bind:value={$formData.parentId} hidden />
			{/snippet}
		</Form.Control>
	</Form.Field>

	<Form.Errors errors={$errors._errors} />

	<div class="ml-auto mt-2 flex w-fit flex-row-reverse gap-2">
		<Form.LoadingButton {loading}>
			{#if !loading}
				<Send class="mr-2" />
			{/if}
			<p>{isComment ? 'Comment' : 'Twiddle'}</p>
		</Form.LoadingButton>

		<TooltippedProgressCircle current={sanitizedContentLength} max={MAX_CONTENT_LENGTH} />
	</div>
</form>
