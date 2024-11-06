import { refreshSession } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handleAuth: Handle = async ({ resolve, event }) => {
	await refreshSession(event);

	return resolve(event);
};
