import { MAINTENANCE_MODE } from '$env/static/private';
import { route } from '$lib/ROUTES';

export const handlerRedirect = (status: number, key: Parameters<typeof route>[0]) =>
	new Response(null, {
		status,
		headers: { location: route(key) }
	});

export enum MaintenanceMode {
	UNRESTRICTED = 0,
	ADMIN_ONLY = 1,
	LOCKED = 2
}

export const getMaintenanceMode = (): MaintenanceMode => {
	const mode = parseInt(MAINTENANCE_MODE ?? '1');

	if (Object.values(MaintenanceMode).includes(mode)) {
		return mode;
	}

	return MaintenanceMode.ADMIN_ONLY;
};
