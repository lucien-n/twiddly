import { dev } from '$app/environment';
import { setProfileSchema, type SetProfileInput } from '$lib/schemas/profile/set-profile';
import { isVerified } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import { error, fail, type Action } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const setProfile: Action = async (event) => {
	if (!isVerified(event)) return fail(401);

	const form = await superValidate(event, zod(setProfileSchema));
	if (!form.valid) {
		return fail(400, { setProfileForm: form });
	}

	const currentProfile = await prisma.profile.findUnique({
		where: { id: event.locals.session.userId },
		select: {
			bio: true,
			displayName: true,
			avatarBackgroundColor: true
		}
	});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const updatedData: any = Object.fromEntries(
		Object.entries(form.data).filter(
			([field, value]) => value !== currentProfile?.[field as keyof SetProfileInput]
		)
	);
	if (Object.keys(updatedData).length === 0) {
		return { setProfileForm: form };
	}

	try {
		await prisma.profile.update({
			data: updatedData,
			where: { id: event.locals.session.userId },
			select: {
				id: true // EMPTY SELECT
			}
		});
	} catch (e) {
		if (dev) console.error(e);

		error(500, { message: 'An error occured' });
	}
};
