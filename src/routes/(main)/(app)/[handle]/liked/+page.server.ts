import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { getProfileSelect } from '$lib/utils/profile';
import { formatProfile, formatTwiddles, type Profile } from '$lib';
import { getTwiddleSelect, getTwiddleWhere } from '@/lib/utils/twiddle';
import { error } from '@sveltejs/kit';

const getLikedTwiddles = async (profile: Profile) => {
	const select = getTwiddleSelect(profile.id);
	const twiddles = await prisma.twiddle.findMany({
		select: { ...select, parent: { select } },
		where: getTwiddleWhere({
			likes: { some: { profileId: profile.id } }
		})
	});

	return formatTwiddles(twiddles, profile.id);
};

export const load: PageServerLoad = async (event) => {
	const data = await prisma.profile.findFirst({
		select: getProfileSelect(),
		where: { handle: event.params.handle }
	});
	if (!data) {
		error(404, `Profile @${event.params.handle} not found`);
	}

	const profile = formatProfile(data);
	if (profile.isPrivate) {
		error(401, `@${event.params.handle}'s profile is private`);
	}

	return {
		twiddles: await getLikedTwiddles(profile)
	};
};
