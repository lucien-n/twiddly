import { dev } from '$app/environment';
import {
	setInterfaceSettingsSchema,
	setPrivacySettingsSchema
} from '$lib/schemas/settings/set-settings';
import { isVerified } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import { error, fail, type Action } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const setInterfaceSettings: Action = async (event) => {
	if (!isVerified(event)) return fail(401);

	const form = await superValidate(event, zod(setInterfaceSettingsSchema));
	if (!form.valid) {
		return fail(400, {
			setSettingsForm: form
		});
	}

	const { themeMode, themeColor } = form.data;
	try {
		await prisma.interfaceSettings.update({
			data: {
				themeMode,
				themeColor
			},
			where: {
				profileId: event.locals.session.userId
			},
			select: {
				profileId: true // EMPTY SELECT
			}
		});
	} catch (e) {
		if (dev) console.error(e);

		error(500, { message: 'An error occured' });
	}
};

export const setPrivacySettings: Action = async (event) => {
	if (!isVerified(event)) return fail(401);

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
				profileId: event.locals.session.userId
			},
			select: {
				profileId: true // EMPTY SELECT
			}
		});
	} catch (e) {
		if (dev) console.error(e);

		error(500, { message: 'An error occured' });
	}
};
