<script lang="ts">
	import { PasswordInput } from '&/input';
	import { route } from '$lib/ROUTES';
	import { signInSchema, type SignInSchema } from '$lib/schemas/auth/sign-in';
	import { onSuperFormError } from '$lib/utils/super-form';
	import * as Form from '&/ui/form';
	import { Input } from '&/ui/input';
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
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Email</Form.Label>
				<Input {...props} bind:value={$formData.email} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Password</Form.Label>
				<PasswordInput {...props} bind:value={$formData.password} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Errors errors={$errors._errors} />

	<Form.LoadingButton class="w-full" {loading} disabled={!$tainted}>
		{loading ? 'Signing In' : 'Sign In'}
	</Form.LoadingButton>
</form>
