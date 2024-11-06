import { formatTwiddles } from '$lib';
import { setProfileSchema } from '$lib/schemas/profile/set-profile';
import { prisma } from '$lib/server/prisma';
import { getProfileSelect } from '$lib/utils/profile';
import { getTwiddleSelect, getTwiddleWhere } from '$lib/utils/twiddle';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { isAdmin } from '@/lib/server/auth';

const getTwiddles = async (profileId: string, currentUserId?: string) => {
	const twiddles = await prisma.twiddle.findMany({
		orderBy: { createdAt: 'desc' },
		select: getTwiddleSelect(currentUserId),
		where: getTwiddleWhere({ authorId: profileId })
	});

	return formatTwiddles(twiddles, currentUserId);
};

export const load: PageServerLoad = async (event) => {
	const { handle } = event.params;

	const profile = await prisma.profile.findFirst({
		where: { handle, user: { deletedAt: null } },
		select: getProfileSelect()
	});
	if (!profile) error(404, `Profile @${handle} not found`);
	if (
		!isAdmin(event) &&
		profile.privacySettings?.private &&
		profile.id !== event.locals.session?.userId
	)
		error(401, `@${handle}'s profile is private`);

	return {
		profile,
		twiddles: await getTwiddles(profile.id, event.locals.session?.userId),
		setProfileForm: await superValidate(profile, zod(setProfileSchema))
	};
};
