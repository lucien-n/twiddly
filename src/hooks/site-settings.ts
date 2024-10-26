import { prisma } from '$lib/server/prisma';
import type { Handle } from '@sveltejs/kit';

export const handleSiteSettings: Handle = async ({ event, resolve }) => {
	if (!event.locals.siteSettings) {
		event.locals.siteSettings = await prisma.siteSettings.findFirst();
	}

	return resolve(event);
};
