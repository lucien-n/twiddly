import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { otpSchema } from '$lib/schemas/auth/otp';

export const load: PageServerLoad = async () => ({
	otpForm: await superValidate(zod(otpSchema))
});
