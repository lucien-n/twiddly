import { dev } from '$app/environment';
import { route } from '$lib/ROUTES';
import { signUpSchema } from '$lib/schemas/auth/sign-up.js';
import { signUpWithEmailAndPassword } from '$lib/server/auth';
import { AuthError, AuthErrorCode } from '$lib/utils/auth-error';
import { error, redirect } from '@sveltejs/kit';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	if (event.locals.session) {
		redirect(302, route('/'));
	}

	return {
		form: await superValidate(zod(signUpSchema))
	};
};

export const actions = {
	default: async (event) => {
		if (event.locals.session) {
			redirect(302, route('/'));
		}

		const form = await superValidate(event, zod(signUpSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { email, password, username } = form.data;

		try {
			await signUpWithEmailAndPassword(event, email, password, username);
		} catch (e) {
			if (dev) console.error(e);

			if (!(e instanceof AuthError)) return error(500, { message: 'An unknown error occurred' });

			switch (e.code) {
				case AuthErrorCode.EmailAlreadyInUse:
					return setError(form, 'email', 'Already in use');
				default:
					return error(500, { message: 'An error occured' });
			}
		}

		redirect(302, route('/'));
	}
};
