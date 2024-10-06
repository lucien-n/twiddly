<script lang="ts">
	import { route } from '$lib/ROUTES';
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
	import { toast } from 'svelte-sonner';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { PostCard, PostContext } from '..';
	import PostContentField from '../form/fields/post-content-field.svelte';
	import { getPostState } from '../state/post-state.svelte';

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
			edited: true
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

	$effect(() => {
		$formData = {
			id: postState.reposting ? undefined : postState.post.id,
			content: postState.reposting ? '' : postState.post.content,
			sourcePostId: postState.reposting ? postState.post.id : null
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
					{#if postState.reposting}
						{loading ? 'Reposting' : 'Repost'}
					{:else}
						{loading ? 'Editing' : 'Edit'}
					{/if}
				</LoadingButton>
			</Dialog.Footer>

			{#if postState && postState.reposting}
				<Form.Field {form} name="sourcePostId">
					<Form.Control let:attrs>
						<input {...attrs} hidden bind:value={$formData.sourcePostId} />
					</Form.Control>
				</Form.Field>

				<PostContext init={{ post: postState.post, setPostForm: postState.setPostForm }}>
					<PostCard />
				</PostContext>
			{/if}
		</form>
	</Dialog.Content>
</Dialog.Root>
