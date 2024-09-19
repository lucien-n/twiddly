import { route } from '$lib/ROUTES';
import { handlerRedirect } from '$lib/server/utils';
import type { Handle } from '@sveltejs/kit';

export const handleRouting: Handle = ({ event, resolve }) => {
	if (!event.locals.session && !event.url.pathname.startsWith(route('/sign-in')))
		return handlerRedirect(303, route('/sign-in'));

	return resolve(event);
};
