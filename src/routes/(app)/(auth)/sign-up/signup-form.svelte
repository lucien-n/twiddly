<script lang="ts">
	import { signUpSchema, type SignUpSchema } from '$lib/schemas/auth/sign-up';
	import * as Form from '&/form';
	import { Input } from '&/input';
	import { toast } from 'svelte-sonner';
	import { zodClient, type Infer } from 'sveltekit-superforms/adapters';
	import { superForm, type SuperValidated } from 'sveltekit-superforms/client';

	type Props = {
		data: SuperValidated<Infer<SignUpSchema>>;
		class?: string;
	};
	const { data, class: className }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(signUpSchema),
		onError: ({ result }) => toast.error(result.error.message)
	});
	const { form: formData, enhance, errors, submitting } = form;
</script>

<form method="post" use:enhance class={className}>
	<Form.Field {form} name="displayName">
		<Form.Control let:attrs>
			<Form.Label>Display Name</Form.Label>
			<Input {...attrs} bind:value={$formData.displayName} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

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

	<Form.Button class="w-full" disabled={$submitting}>Sign Up</Form.Button>
</form>
