<script lang="ts">
	import { otpSchema } from '$lib/schemas/auth/otp';
	import { onSuperFormError } from '$lib/utils/super-form';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '&/form';
	import { route } from '$lib/ROUTES';
	import { Input } from '&/input';
	import { AuthLayout } from '@/auth';

	const { data } = $props();

	const form = superForm(data.otpForm, {
		validators: zodClient(otpSchema),
		onError: onSuperFormError
	});
	const { form: formData, enhance, errors, tainted, submitting } = form;

	const loading = $derived($submitting);
</script>

<AuthLayout title="Verify your email" description="Fill in the code you've received by email">
	{#snippet children()}
		<form method="POST" action={route('otpVerification /actions/v1/auth')} use:enhance>
			<Form.Field {form} name="otp">
				<Form.Control let:attrs>
					<Form.Label>Code</Form.Label>
					<Input {...attrs} bind:value={$formData.otp} />
				</Form.Control>
			</Form.Field>

			<Form.Errors errors={$errors._errors} />

			<Form.LoadingButton class="mt-3 w-full" {loading} disabled={!$tainted}>
				{loading ? 'Verifying' : 'Verify'}
			</Form.LoadingButton>
		</form>
	{/snippet}
</AuthLayout>
