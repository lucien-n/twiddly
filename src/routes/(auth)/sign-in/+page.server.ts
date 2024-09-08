import { dev } from '$app/environment';
import { AuthError, AuthErrorCode } from '$lib/utils/auth-error';
import { route } from '$lib/ROUTES';
import { error, redirect } from '@sveltejs/kit';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { signInSchema } from '$lib/schemas/auth/sign-in.js';
import { signInWithEmailAndPassword } from '$lib/server/auth';

export const load = async (event) => {
	if (event.locals.session) {
		redirect(302, route('/'));
	}

	return {
		form: await superValidate(zod(signInSchema))
	};
};

export const actions = {
	default: async (event) => {
		if (event.locals.session) {
			redirect(302, route('/'));
		}

		const form = await superValidate(event, zod(signInSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { email, password } = form.data;
		try {
			await signInWithEmailAndPassword(event, email, password);
		} catch (e) {
			if (dev) console.error(e);

			if (!(e instanceof AuthError)) return error(500, { message: 'An unknown error occurred' });

			switch (e.code) {
				case AuthErrorCode.InvalidCredentials:
					return setError(form, 'Invalid credentials');
				default:
					return error(500, { message: 'An error occured' });
			}
		}

		return { form };
	}
};
