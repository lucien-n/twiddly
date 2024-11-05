import { route } from '$lib/ROUTES';
import { otpSchema } from '$lib/schemas/auth/otp';
import { isVerified } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (isVerified(event)) {
		redirect(302, route('/'));
	}

	return {
		otpForm: await superValidate(zod(otpSchema))
	};
};
