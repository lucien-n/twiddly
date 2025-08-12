import { route } from '$lib/ROUTES';
import { signInSchema } from '$lib/schemas/auth/sign-in';
import { isAuthenticated } from '@/lib/server/auth.old';
import { redirect, type Actions } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	if (isAuthenticated(event)) {
		redirect(302, route('/'));
	}

	const signInForm = await superValidate(zod4(signInSchema));

	return {
		signInForm
	};
};

export const actions: Actions = {
	default: async (event) => {
		if (isAuthenticated(event)) {
			redirect(302, route('/'));
		}

		const signInForm = await superValidate(event, zod4(signInSchema));
		if (!signInForm.valid) {
			return fail(400, {
				signInForm
			});
		}
	}
};
