import { route } from '$lib/ROUTES';
import { handlerRedirect } from '$lib/server/utils';
import { Role } from '@prisma/client';
import { type Handle } from '@sveltejs/kit';

export const handleRouting: Handle = ({ event, resolve }) => {
	if (event.url.pathname.startsWith('<admin-route>') && event.locals.profile?.role !== Role.ADMIN)
		return handlerRedirect(303, route('/'));

	if (
		!event.locals.session &&
		![route('/sign-in'), route('/sign-up')].some((pathname) =>
			event.url.pathname.startsWith(pathname)
		)
	)
		return handlerRedirect(303, route('/sign-in'));

	return resolve(event);
};
