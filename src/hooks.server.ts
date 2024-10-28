import { sequence } from '@sveltejs/kit/hooks';
import type { Handle, HandleServerError } from '@sveltejs/kit';
import { handleAuth } from './lib/hooks/auth';
import { handleRouting } from './lib/hooks/routing';
import { handleSiteSettings } from './lib/hooks/site-settings';

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
