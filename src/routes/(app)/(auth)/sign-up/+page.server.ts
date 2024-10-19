import { route } from '$lib/ROUTES';
import { signUpSchema } from '$lib/schemas/auth/sign-up';
import { isAuthenticated } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	if (isAuthenticated(event)) {
		redirect(302, route('/'));
	}

	return {
		signUpForm: await superValidate(zod(signUpSchema))
	};
};
