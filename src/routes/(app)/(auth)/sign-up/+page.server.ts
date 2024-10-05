import { route } from '$lib/ROUTES';
import { signUpSchema } from '$lib/schemas/auth/sign-up.js';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	if (event.locals.session) {
		redirect(302, route('/'));
	}

	return {
		signUpForm: await superValidate(zod(signUpSchema))
	};
};
