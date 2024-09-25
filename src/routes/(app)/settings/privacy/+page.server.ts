import { route } from '$lib/ROUTES';
import { setPrivacySettingsSchema } from '$lib/schemas/settings/set-settings';
import { prisma } from '$lib/server/prisma';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { dev } from '$app/environment';

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

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.session) return fail(401);

		const form = await superValidate(event, zod(setPrivacySettingsSchema));
		if (!form.valid) {
			return fail(400, {
				setSettingsForm: form
			});
		}

		const { private: privateProfile } = form.data;
		try {
			await prisma.privacySettings.update({
				data: {
					private: privateProfile
				},
				where: {
					userId: event.locals.session.userId
				},
				select: {
					userId: true // EMPTY SELECT
				}
			});
		} catch (e) {
			if (dev) console.error(e);

			error(500, { message: 'An error occured' });
		}
	}
};
