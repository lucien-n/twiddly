import { route } from '$lib/ROUTES';
import { signInSchema } from '$lib/schemas/auth/sign-in';
import { isAuthenticated } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	if (isAuthenticated(event)) {
		redirect(302, route('/'));
	}

	const signInForm = await superValidate(zod(signInSchema));

	return {
		signInForm
	};
};
