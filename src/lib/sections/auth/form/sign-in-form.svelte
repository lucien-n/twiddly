<script lang="ts">
	import { PasswordInput } from '$lib/components/input';
	import { route } from '$lib/ROUTES';
	import { signInSchema, type SignInSchema } from '$lib/schemas/auth/sign-in';
	import { onSuperFormError } from '$lib/utils/super-form';
	import * as Form from '&/form';
	import { Input } from '&/input';
	import { zodClient, type Infer } from 'sveltekit-superforms/adapters';
	import { superForm, type SuperValidated } from 'sveltekit-superforms/client';

	type Props = {
		data: SuperValidated<Infer<SignInSchema>>;
		class?: string;
	};
	const { data, class: className }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(signInSchema),
		onError: onSuperFormError
	});
	const { form: formData, enhance, errors, submitting, tainted } = form;

	const loading = $derived($submitting);
</script>

<form method="POST" action={route('signIn /actions/v1/auth')} use:enhance class={className}>
	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label>Email</Form.Label>
			<Input {...attrs} bind:value={$formData.email} />
		</Form.Control>
		<!-- <Form.FieldErrors /> -->
	</Form.Field>

	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label>Password</Form.Label>
			<PasswordInput bind:value={$formData.password} {attrs} />
		</Form.Control>
		<!-- <Form.FieldErrors /> -->
	</Form.Field>

	<Form.Errors errors={$errors._errors} />

	<Form.LoadingButton class="w-full" {loading} disabled={!$tainted}>
		{loading ? 'Signing In' : 'Sign In'}
	</Form.LoadingButton>
</form>
