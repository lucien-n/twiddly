import { route } from '$lib/ROUTES';
import { signInSchema } from '$lib/schemas/auth/sign-in.js';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	if (event.locals.session) {
		redirect(302, route('/'));
	}

	return {
		signInForm: await superValidate(zod(signInSchema))
	};
};
