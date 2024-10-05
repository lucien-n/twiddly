import { route } from '$lib/ROUTES';
import { handlerRedirect } from '$lib/server/utils';
import { Role } from '@prisma/client';
import { type Handle } from '@sveltejs/kit';

const unauthicatedAutorizedRoutes = [
	route('/sign-in'),
	route('/sign-up'),
	route('signIn /actions/v1/auth'),
	route('signUp /actions/v1/auth')
];

export const handleRouting: Handle = ({ event, resolve }) => {
	if (event.url.pathname.startsWith('<admin-route>') && event.locals.profile?.role !== Role.ADMIN)
		return handlerRedirect(303, route('/'));

	if (
		!event.locals.session &&
		!unauthicatedAutorizedRoutes.some((pathname) => pathname.split('?')[0] === event.url.pathname)
	)
		return handlerRedirect(303, route('/sign-in'));

	return resolve(event);
};
