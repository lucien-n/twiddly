<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { createPostSchema, type CreatePostSchema } from '$lib/schemas/post/create-post';
	import * as Form from '&/form';
	import { Input } from '&/input';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	interface Props {
		data: SuperValidated<Infer<CreatePostSchema>>;
	}

	const { data }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(createPostSchema),
		onError: ({ result }) => toast.error(result.error.message)
	});
	const { form: formData, enhance, submitting } = form;
</script>

<form method="post" action={route('createPost /')} use:enhance>
	<Form.Field {form} name="content">
		<Form.Control let:attrs>
			<Form.Label>Content</Form.Label>
			<Input {...attrs} bind:value={$formData.content} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button class="w-full" disabled={$submitting}>Post</Form.Button>
</form>
