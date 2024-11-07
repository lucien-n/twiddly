import { formatProfile, formatTwiddles } from '$lib';
import { setProfileSchema } from '$lib/schemas/profile/set-profile';
import { prisma } from '$lib/server/prisma';
import { getProfileSelect } from '$lib/utils/profile';
import { getTwiddleSelect, getTwiddleWhere } from '$lib/utils/twiddle';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { isAdmin } from '$lib/server/auth';

const getTwiddles = async (profileId: string, currentUserId?: string) => {
	const twiddles = await prisma.twiddle.findMany({
		orderBy: { createdAt: 'desc' },
		select: {
			...getTwiddleSelect(currentUserId),
			parent: { select: getTwiddleSelect(currentUserId) }
		},
		where: getTwiddleWhere({ authorId: profileId })
	});

	return formatTwiddles(twiddles, currentUserId);
};

export const load: PageServerLoad = async (event) => {
	const { handle } = event.params;

	const data = await prisma.profile.findFirst({
		where: { handle, user: { deletedAt: null } },
		select: getProfileSelect()
	});
	if (!data) error(404, `Profile @${handle} not found`);
	const profile = formatProfile(data);
	if (!isAdmin(event) && profile.isPrivate && profile.id !== event.locals.session?.userId)
		error(401, `@${handle}'s profile is private`);

	return {
		profile,
		twiddles: await getTwiddles(profile.id, event.locals.session?.userId),
		setProfileForm: await superValidate(data, zod(setProfileSchema))
	};
};
