import { lucia } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import type { Profile } from '@prisma/client';
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

	let profile: Profile | null = null;
	if (session) {
		profile = await prisma.profile.findFirst({
			where: { id: session.userId },
			include: { interfaceSettings: true, privacySettings: true }
		});
	}

	event.locals.user = user;
	event.locals.session = session;
	event.locals.profile = profile;

	return resolve(event);
};
