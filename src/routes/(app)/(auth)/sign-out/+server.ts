import { route } from '$lib/ROUTES';
import { lucia } from '$lib/server/lucia';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async (event) => {
	if (!event.locals.session) {
		redirect(302, route('/'));
	}

	await lucia.invalidateSession(event.locals.session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	event.cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});

	redirect(302, route('/'));
};
