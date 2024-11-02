import { prisma } from '$lib/server/prisma';
import type { SiteSettings } from '@prisma/client';
import type { Handle } from '@sveltejs/kit';

let siteSettings: SiteSettings | null = $state(null);

export const setSiteSettings = (newSiteSettings: SiteSettings | null) => {
	siteSettings = newSiteSettings;
};

export const handleSiteSettings: Handle = async ({ event, resolve }) => {
	if (!siteSettings) {
		siteSettings = await prisma.siteSettings.findFirst();
	}

	event.locals.siteSettings = siteSettings;

	return resolve(event);
};
