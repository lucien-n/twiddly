<script lang="ts">
	import { setPostSchema, type SetPostSchema } from '$lib/schemas/post/set-post';
	import {
		handleSuperResult,
		onSuperFormError,
		type ActionResultSuccess
	} from '$lib/utils/super-form';
	import * as Dialog from '&/dialog';
	import * as Form from '&/form';
	import { LoadingButton } from '&/form';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import PostContentField from '../form/fields/post-content-field.svelte';
	import { getPostState } from '../state/post-state.svelte';
	import { route } from '$lib/ROUTES';

	interface Props {
		open: boolean;
	}
	let { open = $bindable() }: Props = $props();
	const postState = getPostState();

	const handleSubmit: SubmitFunction = ({ formData, cancel }) => {
		const content = formData.get('content')?.toString();
		if (content && content.length) return;

		cancel();
		postState.openSetDialog = false;
		postState.openDeleteDialog = true;
	};

	const handleSuccess = (
		result: ActionResultSuccess<{ setPostForm?: SuperValidated<Infer<SetPostSchema>> }>
	) => {
		toast.success('Post updated');
		open = false;

		if (!result.data?.setPostForm) return;

		const form = result.data.setPostForm;
		postState.post = {
			...postState.post,
			...form.data,
			editedAt: new Date()
		};
	};

	const form = superForm(postState.setPostForm, {
		id: `set-post-${postState.post.id}`,
		validators: zodClient(setPostSchema),
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
			id: postState.post.id,
			content: postState.post.content
		};
		$tainted = undefined;
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<form action={route('setPost /actions/v1/post')} method="post" use:enhance>
			<Dialog.Header>
				<Dialog.Title>Edit post</Dialog.Title>
			</Dialog.Header>
			<div class="my-3">
				<PostContentField {form} />
			</div>

			<Form.Field {form} name="id">
				<Form.Control let:attrs>
					<input {...attrs} hidden bind:value={$formData.id} />
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
