import { formatTwiddles, getTwiddleSelect, getTwiddleWhere } from '$lib/models';
import { prisma } from '$lib/server/prisma';

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

export const load = async (event) => {
	const { profile } = await event.parent();

	const twiddlesPromise =
		profile.isPrivate && profile.handle !== event.locals.profile.handle
			? []
			: getTwiddles(profile?.id, event.locals.session?.userId);

	return {
		twiddlesPromise
	};
};
