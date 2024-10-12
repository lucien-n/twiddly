import { dev } from '$app/environment';
import { route } from '$lib/ROUTES';
import { otpSchema } from '$lib/schemas/auth/otp';
import { signInSchema } from '$lib/schemas/auth/sign-in';
import { signUpSchema } from '$lib/schemas/auth/sign-up';
import {
	createSession,
	signInWithEmailAndPassword,
	signUpWithEmailAndPassword,
	verifyVerificationCode
} from '$lib/server/auth';
import { lucia } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import { AuthError, AuthErrorCode } from '$lib/utils/auth-error';
import { error, fail, redirect, type Action } from '@sveltejs/kit';
import { superValidate, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const signIn: Action = async (event) => {
	if (event.locals.session) {
		redirect(302, route('/'));
	}

	const signInForm = await superValidate(event, zod(signInSchema));

	if (!signInForm.valid) {
		return fail(400, {
			signInForm
		});
	}

	const { email, password } = signInForm.data;
	try {
		await signInWithEmailAndPassword(event, email, password);
	} catch (e) {
		if (dev) console.error(e);

		if (!(e instanceof AuthError)) return error(500, { message: 'An unknown error occurred' });

		switch (e.code) {
			case AuthErrorCode.InvalidCredentials:
				return setError(signInForm, 'Invalid credentials');
			default:
				return error(500, { message: 'An error occured' });
		}
	}

	return { signInForm };
};

export const signUp: Action = async (event) => {
	if (event.locals.session) {
		redirect(302, route('/'));
	}

	const signUpForm = await superValidate(event, zod(signUpSchema));

	if (!signUpForm.valid) {
		return fail(400, {
			signUpForm
		});
	}

	const { email, password, displayName, handle } = signUpForm.data;

	try {
		await signUpWithEmailAndPassword(event, email, password, { displayName, handle });
	} catch (e) {
		if (dev) console.error(e);

		if (!(e instanceof AuthError)) return error(500, { message: 'An unknown error occurred' });

		switch (e.code) {
			case AuthErrorCode.EmailAlreadyInUse:
				return setError(signUpForm, 'email', 'Already in use');
			case AuthErrorCode.HandleAlreadyInUse:
				return setError(signUpForm, 'handle', 'Already in use');
			case AuthErrorCode.InvalidHandle:
				return setError(signUpForm, 'handle', 'Invalid');
			default:
				return error(500, { message: 'An error occured' });
		}
	}

	redirect(302, route('/verify'));
};

export const signOut: Action = async (event) => {
	if (!event.locals.session) {
		return redirect(302, route('/'));
	}

	await lucia.invalidateSession(event.locals.session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	event.cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});

	return redirect(302, route('/'));
};

export const otpVerification: Action = async (event) => {
	if (!event.locals.session || !event.locals.user) {
		return redirect(302, route('/'));
	}

	const otpForm = await superValidate(event, zod(otpSchema));
	if (!otpForm.valid) {
		return fail(400, {
			otpForm
		});
	}

	const { otp } = otpForm.data;
	const validCode = await verifyVerificationCode(event.locals.user, otp);
	if (!validCode) {
		return setError(otpForm, 'Invalid code');
	}

	await lucia.invalidateSession(event.locals.session.id);
	await prisma.user.update({
		data: { emailVerified: true },
		where: { id: event.locals.session.userId }
	});

	await createSession(event.locals.session.userId, event);

	return redirect(302, route('/'));
};
