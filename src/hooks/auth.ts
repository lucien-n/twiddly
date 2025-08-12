import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { svelteKitHandler } from 'better-auth/svelte-kit';

export const handleAuth: Handle = async ({ resolve, event }) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};
