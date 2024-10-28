<script lang="ts">
	import { setTwiddleSchema, type SetTwiddlechema } from '$lib/schemas/twiddle/set-twiddle';
	import {
		handleSuperResult,
		onSuperFormError,
		type ActionResultSuccess
	} from '$lib/utils/super-form';
	import * as Dialog from '&/ui/dialog';
	import * as Form from '&/ui/form';
	import { LoadingButton } from '&/ui/form';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import TwiddleContentField from '../form/fields/twiddle-content-field.svelte';
	import { getTwiddleState } from '../state/twiddle-state.svelte';
	import { route } from '$lib/ROUTES';

	interface Props {
		open: boolean;
	}
	let { open = $bindable() }: Props = $props();
	const twiddle = getTwiddleState();

	const handleSubmit: SubmitFunction = ({ formData, cancel }) => {
		const content = formData.get('content')?.toString();
		if (content && content.length) return;

		cancel();
		twiddle.openSetDialog = false;
		twiddle.openDeleteDialog = true;
	};

	const handleSuccess = (
		result: ActionResultSuccess<{ setTwiddleForm?: SuperValidated<Infer<SetTwiddlechema>> }>
	) => {
		toast.success('Twiddle updated');
		open = false;

		if (!result.data?.setTwiddleForm) return;

		const form = result.data.setTwiddleForm;
		twiddle.data = {
			...twiddle.data,
			...form.data
		};
		twiddle.data.isEdited = true;
	};

	const form = superForm(twiddle.setTwiddleForm, {
		id: `set-twiddle-${twiddle.data.id}`,
		validators: zodClient(setTwiddleSchema),
		onError: onSuperFormError,
		onSubmit: handleSubmit,
		onResult: (event) =>
			handleSuperResult(event, {
				onSuccess: handleSuccess
			})
	});
	const { form: formData, enhance, submitting, tainted } = form;

	const loading = $derived($submitting);

	onMount(() => {
		$formData = {
			id: twiddle.data.id,
			content: twiddle.data.content
		};
		$tainted = undefined;
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<form method="post" action={route('setTwiddle /actions/v1/twiddle')} use:enhance>
			<Dialog.Header>
				<Dialog.Title>Edit twiddle</Dialog.Title>
			</Dialog.Header>
			<div class="my-3">
				<TwiddleContentField {form} />
			</div>

			<Form.Field {form} name="id">
				<Form.Control>
					{#snippet children({ props })}
						<input {...props} hidden bind:value={$formData.id} />
					{/snippet}
				</Form.Control>
			</Form.Field>

			<Dialog.Footer>
				<LoadingButton {loading} disabled={!$tainted}>
					{loading ? 'Editing' : 'Edit'}
				</LoadingButton>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
