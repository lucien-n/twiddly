<script lang="ts">
	import { setPostSchema, type SetPostSchema } from '$lib/schemas/post/set-post';
	import { onSuperFormError } from '$lib/utils/super-form';
	import * as Form from '&/form';
	import { Send } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { Infer, SuperValidated } from 'sveltekit-superforms/client';
	import PostContentField from './fields/post-content-field.svelte';

	interface Props {
		setPostForm: SuperValidated<Infer<SetPostSchema>>;
		action: string;
	}
	const { setPostForm, action }: Props = $props();

	const form = superForm(setPostForm, {
		validators: zodClient(setPostSchema),
		onError: onSuperFormError
	});
	const { enhance, submitting, errors } = form;

	const loading = $derived($submitting);
</script>

<form method="post" {action} use:enhance>
	<PostContentField {form} />

	<Form.Errors errors={$errors._errors} />

	<div class="ml-auto mt-2 w-fit">
		<Form.LoadingButton {loading}>
			{#if !loading}
				<Send class="mr-2" />
			{/if}
			<p>Post</p>
		</Form.LoadingButton>
	</div>
</form>
