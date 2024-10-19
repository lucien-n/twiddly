import { MAINTENANCE_MODE } from '$env/static/private';
import { route } from '$lib/ROUTES';

export const handlerRedirect = (status: number, key: Parameters<typeof route>[0]) =>
	new Response(null, {
		status,
		headers: { location: route(key) }
	});

export type MaintenanceMode = 0 | 1 | 2;
export const getMaintenanceMode = (): MaintenanceMode =>
	['0', '1', '2'].includes(MAINTENANCE_MODE) ? (parseInt(MAINTENANCE_MODE) as MaintenanceMode) : 1;
