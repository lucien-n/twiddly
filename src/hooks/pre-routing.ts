import { MaintenanceMode } from '$lib/server/types';
import { getMaintenanceMode } from '$lib/server/utils';
import type { Handle } from '@sveltejs/kit';
import { error } from 'console';

export const handlePreRouting: Handle = ({ event, resolve }) => {
	if (getMaintenanceMode() === MaintenanceMode.LOCKED) {
		throw error(503, 'Twiddly is under maintenance.');
	}

	return resolve(event);
};
