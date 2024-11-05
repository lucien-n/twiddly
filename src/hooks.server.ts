import { sequence } from '@sveltejs/kit/hooks';
import type { Handle, HandleServerError } from '@sveltejs/kit';
import { handleAuth } from './hooks/auth';
import { handleRouting } from './hooks/routing';
import { handleSiteSettings } from './hooks/site-settings.svelte';

export const handle: Handle = sequence(
	handleSiteSettings,
	handleRouting.beforeAuth,
	handleAuth,
	handleRouting.afterAuth
);

export const handleError: HandleServerError = ({ error, message, status }) => {
	console.error(error);

	return {
		message,
		status
	};
};
