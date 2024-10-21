import { route } from '$lib/ROUTES';
import { MaintenanceMode } from '$lib/server/types';
import { getMaintenanceMode, handlerRedirect } from '$lib/server/utils';
import { Role } from '@prisma/client';
import { error, type Handle } from '@sveltejs/kit';

const signInRoutes = [route('/sign-in'), route('signIn /actions/v1/auth')];

const unauthenticatedAutorizedRoutes = [
	...signInRoutes,
	route('/sign-up'),
	route('signUp /actions/v1/auth')
];

export const handleRouting: Handle = ({ event, resolve }) => {
	const maintenanceMode = getMaintenanceMode();
	const isAdmin = event.locals.profile?.role === Role.ADMIN;

	if (maintenanceMode === MaintenanceMode.ADMIN_ONLY && !isAdmin) {
		if (signInRoutes.some((p) => p.split('?')[0] === event.url.pathname)) {
			return resolve(event);
		}

		throw error(503, 'Twiddly is under maintenance (Admin access only).');
	}

	if (maintenanceMode === MaintenanceMode.LOCKED) {
		throw error(503, 'Twiddly is under maintenance.');
	}

	if (event.url.pathname.startsWith('/admin') && !isAdmin) {
		return handlerRedirect(303, '/');
	}

	if (
		!event.locals.session &&
		!unauthenticatedAutorizedRoutes.some((p) => p.split('?')[0] === event.url.pathname)
	) {
		return handlerRedirect(303, '/sign-in');
	}

	return resolve(event);
};
