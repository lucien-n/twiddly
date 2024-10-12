<script lang="ts">
	import { PasswordInput } from '$lib/components/input';
	import { route } from '$lib/ROUTES';
	import { signUpSchema, type SignUpSchema } from '$lib/schemas/auth/sign-up';
	import { generateHandle } from '$lib/utils/handle';
	import { onSuperFormError } from '$lib/utils/super-form';
	import * as Form from '&/form';
	import { Input } from '&/input';
	import { zodClient, type Infer } from 'sveltekit-superforms/adapters';
	import { superForm, type SuperValidated } from 'sveltekit-superforms/client';

	type Props = {
		data: SuperValidated<Infer<SignUpSchema>>;
		class?: string;
	};
	const { data, class: className }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(signUpSchema),
		onError: onSuperFormError
	});
	const { form: formData, enhance, errors, submitting, tainted } = form;

	const loading = $derived($submitting);
</script>

<form method="post" action={route('signUp /actions/v1/auth')} use:enhance class={className}>
	<Form.Field {form} name="displayName">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input
				{...attrs}
				bind:value={$formData.displayName}
				oninput={() => {
					$formData.handle = generateHandle($formData.displayName);
				}}
			/>
		</Form.Control>
		<!-- todo: <Form.FieldErrors /> -->
	</Form.Field>

	<Form.Field {form} name="handle">
		<Form.Control let:attrs>
			<Form.Label>Handle</Form.Label>
			<div class="relative">
				<span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
				<Input {...attrs} bind:value={$formData.handle} class="pl-7" />
			</div>
		</Form.Control>
		<!-- todo: <Form.FieldErrors /> -->
	</Form.Field>

	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label>Email</Form.Label>
			<Input {...attrs} bind:value={$formData.email} />
		</Form.Control>
		<!-- todo: <Form.FieldErrors /> -->
	</Form.Field>

	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label>Password</Form.Label>
			<PasswordInput bind:value={$formData.password} {attrs} />
		</Form.Control>
		<!-- todo: <Form.FieldErrors /> -->
	</Form.Field>

	<Form.Errors errors={$errors._errors} />

	<Form.LoadingButton class="w-full" {loading} disabled={!$tainted}>
		{loading ? 'Signing Up' : 'Sign Up'}
	</Form.LoadingButton>
</form>
