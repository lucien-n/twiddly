import { MAINTENANCE_MODE } from '$env/static/private';
import { route } from '$lib/ROUTES';
import { handlerRedirect } from '$lib/server/utils';
import { Role } from '@prisma/client';
import { error, type Handle } from '@sveltejs/kit';

const unauthicatedAutorizedRoutes = [
	route('/sign-in'),
	route('/sign-up'),
	route('signIn /actions/v1/auth'),
	route('signUp /actions/v1/auth')
];

type MaintenanceMode = 0 | 1 | 2;

export const handleRouting: Handle = ({ event, resolve }) => {
	const maintenanceMode: MaintenanceMode = ['0', '1', '2'].includes(MAINTENANCE_MODE)
		? (parseInt(MAINTENANCE_MODE) as MaintenanceMode)
		: 1; // default to 1: site accessible only by admins

	switch (maintenanceMode) {
		case 1:
			// still allow access to sign in route
			if (
				event.locals.profile?.role !== Role.ADMIN &&
				![route('/sign-in'), route('signIn /actions/v1/auth').split('?')[0]].includes(
					event.url.pathname
				)
			) {
				return handlerRedirect(303, route('/sign-in'));
			}
			break;
		case 2:
			throw error(503, 'Twiddly is under maintenance');
	}

	if (event.url.pathname.startsWith('<admin-route>') && event.locals.profile?.role !== Role.ADMIN) {
		return handlerRedirect(303, route('/'));
	}

	if (
		!event.locals.session &&
		!unauthicatedAutorizedRoutes.some((pathname) => pathname.split('?')[0] === event.url.pathname)
	) {
		return handlerRedirect(303, route('/sign-in'));
	}

	return resolve(event);
};
