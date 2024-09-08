<script lang="ts">
	import { signInSchema, type SignInSchema } from '$lib/schemas/auth/sign-in';
	import * as Form from '&/form';
	import { Input } from '&/input';
	import { toast } from 'svelte-sonner';
	import { zodClient, type Infer } from 'sveltekit-superforms/adapters';
	import { superForm, type SuperValidated } from 'sveltekit-superforms/client';

	type Props = {
		data: SuperValidated<Infer<SignInSchema>>;
		class?: string;
	};
	const { data, class: className }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(signInSchema),
		onError: ({ result }) => toast.error(result.error.message)
	});
	const { form: formData, enhance, errors, submitting } = form;
</script>

<form method="post" use:enhance class={className}>
	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label>Email</Form.Label>
			<Input {...attrs} bind:value={$formData.email} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label>Password</Form.Label>
			<Input {...attrs} type="password" bind:value={$formData.password} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Errors errors={$errors._errors} />

	<Form.Button class="w-full" disabled={$submitting}>Sign In</Form.Button>
</form>
