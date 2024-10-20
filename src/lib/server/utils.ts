import { MAINTENANCE_MODE } from '$env/static/private';
import { route } from '$lib/ROUTES';
import { MaintenanceMode } from './types';

export const handlerRedirect = (status: number, key: Parameters<typeof route>[0]) =>
	new Response(null, {
		status,
		headers: { location: route(key) }
	});

export const getMaintenanceMode = (): MaintenanceMode => {
	const mode = parseInt(MAINTENANCE_MODE ?? '1');

	if (Object.values(MaintenanceMode).includes(mode)) {
		return mode;
	}

	return MaintenanceMode.ADMIN_ONLY;
};
