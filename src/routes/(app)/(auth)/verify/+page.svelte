<script lang="ts">
	import { enhance as svelteEnhance } from '$app/forms';
	import { route } from '$lib/ROUTES';
	import { otpSchema } from '$lib/schemas/auth/otp';
	import { onSuperFormError } from '$lib/utils/super-form';
	import { Button } from '&/button';
	import * as Form from '&/form';
	import { AuthLayout } from '@/auth';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { OTPInput } from '$lib/components/input';
	import { PageInfos } from '$lib/components/page-infos';

	const { data } = $props();

	const form = superForm(data.otpForm, {
		validators: zodClient(otpSchema),
		onError: onSuperFormError,
		validationMethod: 'onsubmit'
	});
	const { form: formData, enhance, errors, tainted, submitting } = form;

	const loading = $derived($submitting);

	const handleResendSubmit: SubmitFunction = () => {
		return async ({ result }) => {
			switch (result.type) {
				case 'error':
					toast.error(result.error);
					break;
				case 'success':
					toast.success('Code successfully sent');
					break;
				case 'redirect':
					toast.warning('Your email is already verified');
					break;
				default:
					toast.warning('An unknown error occured');
			}
		};
	};
</script>

<PageInfos />

<AuthLayout title="Enter your 6-digit OTP" description="Fill in the code you've received by email">
	{#snippet children()}
		<form method="post" action={route('otpVerification /actions/v1/auth')} use:enhance>
			<Form.Field {form} name="otp">
				<Form.Control let:attrs>
					<Form.Label>Code</Form.Label>
					<OTPInput {attrs} bind:value={$formData.otp} />
				</Form.Control>
			</Form.Field>

			<Form.Errors errors={$errors._errors} />

			<Form.LoadingButton class="mt-3 w-full" {loading} disabled={!$tainted}>
				{loading ? 'Verifying' : 'Verify'}
			</Form.LoadingButton>
		</form>
	{/snippet}

	{#snippet footer()}
		<form
			method="post"
			action={route('sendOtpEmail /actions/v1/auth')}
			use:svelteEnhance={handleResendSubmit}
		>
			Did not receive a code ?
			<Button type="submit" variant="link" class="px-1">Resend</Button>
		</form>
	{/snippet}
</AuthLayout>
