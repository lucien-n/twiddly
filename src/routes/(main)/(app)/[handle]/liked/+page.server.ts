import { formatTwiddles, type Profile } from '$lib';
import { prisma } from '$lib/server/prisma';
import { getTwiddleSelect, getTwiddleWhere } from '$lib/utils/twiddle';
import type { PageServerLoad } from './$types';

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
	const parent = await event.parent();

	return {
		twiddles: await getLikedTwiddles(parent.profile)
	};
};
