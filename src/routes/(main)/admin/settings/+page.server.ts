import { dev } from '$app/environment';
import { adminSetSiteSettingsSchema } from '$lib/schemas/admin/set-site-settings';
import { prisma } from '$lib/server/prisma';
import { setSiteSettings } from '@/hooks/site-settings.svelte';
import { isAdmin } from '@/lib/server/auth.old';
import { error, type Actions } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const setSiteSettingsForm = await superValidate(
		event.locals.siteSettings,
		zod(adminSetSiteSettingsSchema)
	);

	return {
		setSiteSettingsForm
	};
};

export const actions: Actions = {
	setSiteSettings: async (event) => {
		if (!isAdmin(event)) return fail(401);

		const setSiteSettingsForm = await superValidate(event, zod(adminSetSiteSettingsSchema));
		if (!setSiteSettingsForm.valid) {
			return fail(400, {
				setSiteSettingsForm
			});
		}

		const { maintenanceMode } = setSiteSettingsForm.data;
		try {
			const updatedSiteSettings = await prisma.siteSettings.update({
				data: {
					maintenanceMode
				},
				where: { maintenanceMode: event.locals.siteSettings?.maintenanceMode }
			});

			setSiteSettings(updatedSiteSettings);
		} catch (e) {
			if (dev) console.error(e);

			error(500, { message: 'An error occured' });
		}
	}
};
