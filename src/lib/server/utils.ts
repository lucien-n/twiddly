import { route } from '$lib/ROUTES';
import { MaintenanceMode } from '@prisma-app/client';
import type { RequestEvent } from '@sveltejs/kit';

export const handlerRedirect = (status: number, key: Parameters<typeof route>[0]) =>
	new Response(null, {
		status,
		headers: { location: route(key) }
	});

export const getMaintenanceMode = (event: RequestEvent): MaintenanceMode =>
	event.locals.siteSettings?.maintenanceMode ?? MaintenanceMode.AdminOnly;
