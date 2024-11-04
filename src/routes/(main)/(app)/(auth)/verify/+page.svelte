<script lang="ts">
	import { enhance as svelteEnhance } from '$app/forms';
	import { route } from '$lib/ROUTES';
	import { otpSchema } from '$lib/schemas/auth/otp';
	import { onSuperFormError } from '$lib/utils/super-form';
	import { Button } from '&/ui/button';
	import * as Form from '&/ui/form';
	import { AuthLayout } from '#/auth';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as InputOTP from '&/ui/input-otp';
	import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'bits-ui';

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

<AuthLayout
	title="Enter your 6-digit OTP"
	description="Fill in the code you've received by email at {data.user?.email ?? ''}"
>
	{#snippet children()}
		<form
			method="post"
			action={route('otpVerification /actions/v1/auth')}
			use:enhance
			class="space-y-4"
		>
			<Form.Field {form} name="otp">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Code</Form.Label>
						<InputOTP.Root
							{...props}
							maxlength={6}
							pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
							bind:value={$formData.otp}
							class="justify-center"
						>
							{#snippet children({ cells })}
								<InputOTP.Group>
									{#each cells.slice(0, 3) as cell}
										<InputOTP.Slot {cell} />
									{/each}
								</InputOTP.Group>
								<InputOTP.Separator />
								<InputOTP.Group>
									{#each cells.slice(3, 6) as cell}
										<InputOTP.Slot {cell} />
									{/each}
								</InputOTP.Group>
							{/snippet}
						</InputOTP.Root>
					{/snippet}
				</Form.Control>
			</Form.Field>

			<Form.Errors errors={$errors._errors} />

			<Form.LoadingButton class="w-full" {loading} disabled={!$tainted}>
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
