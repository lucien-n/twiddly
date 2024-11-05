import { route } from '$lib/ROUTES';
import { isVerified } from '$lib/server/auth';
import { getMaintenanceMode, handlerRedirect } from '$lib/server/utils';
import { MaintenanceMode, Role } from '@prisma/client';
import { error, type Handle, type RequestEvent } from '@sveltejs/kit';

const signInRoutes = [route('/sign-in'), route('signIn /actions/v1/auth')];

const isInRoute = (event: RequestEvent, routes: string[]) =>
	routes.some((p) => p.split('?')[0] === event.url.pathname);

export const handleRouting: {
	beforeAuth: Handle;
	afterAuth: Handle;
} = {
	beforeAuth: ({ event, resolve }) => {
		if (getMaintenanceMode(event) === MaintenanceMode.LOCKED) {
			error(503, 'Twiddly is under maintenance.');
		}

		return resolve(event);
	},
	afterAuth: ({ event, resolve }) => {
		const maintenanceMode = getMaintenanceMode(event);
		const isAdmin = event.locals.profile?.role === Role.ADMIN;

		switch (maintenanceMode) {
			case MaintenanceMode.VERIFIED: {
				if (isVerified(event) || isInRoute(event, signInRoutes)) break;

				error(503, 'Twiddly access is locked (Verified users only).');
				break;
			}
			case MaintenanceMode.ADMIN: {
				if (isAdmin || isInRoute(event, signInRoutes)) break;

				error(503, 'Twiddly access is locked (Admin only).');
				break;
			}
		}

		if (event.url.pathname.startsWith('/admin') && !isAdmin) {
			return handlerRedirect(303, '/');
		}

		return resolve(event);
	}
};
