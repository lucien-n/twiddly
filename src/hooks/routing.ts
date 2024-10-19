import { route } from '$lib/ROUTES';
import { getMaintenanceMode, handlerRedirect } from '$lib/server/utils';
import { Role } from '@prisma/client';
import { error, type Handle } from '@sveltejs/kit';

const signInRoutes = [route('/sign-in'), route('signIn /actions/v1/auth')];

const unauthicatedAutorizedRoutes = [
	...signInRoutes,
	route('/sign-up'),
	route('signUp /actions/v1/auth')
];

export const handleRouting: Handle = ({ event, resolve }) => {
	switch (getMaintenanceMode()) {
		// todo: DRYify
		case 1:
			if (event.locals.profile) {
				if (event.locals.profile.role === Role.ADMIN) break;
				else throw error(503, 'Twiddly is under maintenance');
			}

			// still allow access to sign in route
			if (signInRoutes.some((p) => p.split('?')[0] === event.url.pathname)) {
				break;
			}

			return handlerRedirect(303, '/sign-in');
		case 2:
			throw error(503, 'Twiddly is under maintenance');
	}

	if (event.url.pathname.startsWith('<admin-route>') && event.locals.profile?.role !== Role.ADMIN) {
		return handlerRedirect(303, '/');
	}

	if (
		!event.locals.session &&
		!unauthicatedAutorizedRoutes.some((pathname) => pathname.split('?')[0] === event.url.pathname)
	) {
		return handlerRedirect(303, '/sign-in');
	}

	return resolve(event);
};
