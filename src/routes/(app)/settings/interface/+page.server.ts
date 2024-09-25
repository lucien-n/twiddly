import { route } from '$lib/ROUTES';
import { setInterfaceSettingsSchema } from '$lib/schemas/settings/set-settings';
import { prisma } from '$lib/server/prisma';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { dev } from '$app/environment';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.session) redirect(303, route('/'));

	const { userId } = event.locals.session;
	const interfaceSettings = await prisma.interfaceSettings.findFirst({
		where: { userId },
		select: {
			theme: true
		}
	});
	if (!interfaceSettings) {
		throw new Error(`Interface settings not found for user "${userId}"`);
	}

	return {
		setSettingsForm: await superValidate(interfaceSettings, zod(setInterfaceSettingsSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.session) return fail(401);

		const form = await superValidate(event, zod(setInterfaceSettingsSchema));
		if (!form.valid) {
			return fail(400, {
				setSettingsForm: form
			});
		}

		const { theme } = form.data;
		try {
			await prisma.interfaceSettings.update({
				data: {
					theme
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
