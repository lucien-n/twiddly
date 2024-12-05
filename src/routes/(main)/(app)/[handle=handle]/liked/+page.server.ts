import { formatTwiddles, getTwiddleSelect, getTwiddleWhere } from '$lib/models';
import { prisma } from '$lib/server/prisma';
import { isReadableByCurrentUser } from '$lib/server/twiddle';
import type { PageServerLoad } from './$types';

const getLikedTwiddles = async (profileId: string, currentUserId?: string) => {
	const select = getTwiddleSelect(currentUserId);
	const twiddles = await prisma.twiddle.findMany({
		select: { ...select, parent: { select } },
		where: getTwiddleWhere({
			likes: { some: { profileId } }
		})
	});

	return formatTwiddles(twiddles, currentUserId);
};

export const load: PageServerLoad = async (event) => {
	const { profile } = await event.parent();
	const currentUserId = event.locals.session?.userId;

	const twiddlesPromise = isReadableByCurrentUser(profile, currentUserId)
		? []
		: getLikedTwiddles(profile.id, currentUserId);

	return {
		twiddlesPromise
	};
};
