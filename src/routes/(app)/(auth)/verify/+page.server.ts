import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { otpSchema } from '$lib/schemas/auth/otp';
import { route } from '$lib/ROUTES';
import { isAuthenticated } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	if (isAuthenticated(event)) {
		redirect(302, route('/'));
	}

	return {
		otpForm: await superValidate(zod(otpSchema))
	};
};
