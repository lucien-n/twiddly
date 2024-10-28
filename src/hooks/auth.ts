import { lucia } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import type { Handle } from '@sveltejs/kit';

export const handleAuth: Handle = async ({ resolve, event }) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}

	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}

	if (session) {
		const profile = await prisma.profile.findFirst({
			where: { id: session.userId },
			include: { interfaceSettings: true, privacySettings: true }
		});

		event.locals.profile = profile;
	} else {
		event.locals.profile = null;
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};
