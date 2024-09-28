<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { createPostSchema, type CreatePostSchema } from '$lib/schemas/post/create-post';
	import { onSuperFormError } from '$lib/utils/super-form';
	import * as Form from '&/form';
	import { Textarea } from '&/textarea';
	import { getAuthState } from '@/auth/auth-state.svelte';
	import { Send } from 'lucide-svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	interface Props {
		data: SuperValidated<Infer<CreatePostSchema>>;
	}

	const { data }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(createPostSchema),
		onError: onSuperFormError
	});
	const { form: formData, enhance, submitting, errors, constraints } = form;

	const authState = getAuthState();

	let rows: number = $state(3);
	$effect(() => {
		const lines = $formData.content.split('\n').length;
		rows = lines < 5 ? 5 : lines;
	});
</script>

<form method="post" action={route('createPost /')} use:enhance>
	<Form.Field {form} name="content">
		<Form.Control let:attrs>
			<Textarea
				{...attrs}
				bind:value={$formData.content as string}
				{rows}
				class="resize-none text-lg"
				minlength={$constraints.content?.minlength}
				maxlength={$constraints.content?.maxlength}
				placeholder="What's up {authState.profile?.displayName ?? 'Stranger'} ?"
				required
			/>
		</Form.Control>
		<Form.Description />
		<Form.FieldErrors />
	</Form.Field>
	<Form.Errors errors={$errors._errors} />
	<div class="flex w-full">
		<div class="ml-auto flex gap-3">
			<p class="select-none self-center text-muted-foreground">
				{$formData.content.length}/{$constraints.content?.maxlength}
			</p>
			<Form.Button disabled={$submitting}>
				<Send />
				<p class="ml-2">Post</p>
			</Form.Button>
		</div>
	</div>
</form>
