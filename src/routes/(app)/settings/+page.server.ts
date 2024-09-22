import { route } from '$lib/ROUTES';
import { setSettingsSchema } from '$lib/schemas/settings/set-settings';
import { prisma } from '$lib/server/prisma';
import { redirect, type Actions } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.session) redirect(303, route('/'));

	const settings = await prisma.settings.findFirst({
		where: { userId: event.locals.session.userId }
	});

	return {
		setSettingsForm: await superValidate(settings, zod(setSettingsSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.session) return fail(401);

		const form = await superValidate(event, zod(setSettingsSchema));
		if (!form.valid) {
			return fail(400, {
				setSettingsForm: form
			});
		}

		const { theme } = form.data;
		await prisma.settings.update({
			data: {
				theme
			},
			where: {
				userId: event.locals.session.userId
			},
			select: {
				theme: true
			}
		});
	}
};
