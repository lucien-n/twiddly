import { formatProfile, getProfileSelect } from '$lib/models';
import { setProfileSchema } from '$lib/schemas/profile/set-profile';
import { isAdmin } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const { handle } = event.params;

	const data = await prisma.profile.findFirst({
		where: { handle, user: { deletedAt: null } },
		select: getProfileSelect()
	});
	if (!data) {
		error(404, `Profile @${handle} not found`);
	}

	const profile = formatProfile(data);
	if (!isAdmin(event) && profile.isPrivate && profile.id !== event.locals.session?.userId) {
		error(401, `@${handle}'s profile is private`);
	}

	return {
		profile,
		setProfileForm: await superValidate(data, zod(setProfileSchema))
	};
};
