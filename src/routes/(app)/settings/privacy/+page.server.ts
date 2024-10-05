import { route } from '$lib/ROUTES';
import { setPrivacySettingsSchema } from '$lib/schemas/settings/set-settings';
import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.session) redirect(303, route('/'));

	const { userId } = event.locals.session;
	const privacySettings = await prisma.privacySettings.findFirst({
		where: { userId },
		select: {
			private: true
		}
	});
	if (!privacySettings) {
		throw new Error(`Interface settings not found for user "${userId}"`);
	}

	return {
		setSettingsForm: await superValidate(privacySettings, zod(setPrivacySettingsSchema))
	};
};
