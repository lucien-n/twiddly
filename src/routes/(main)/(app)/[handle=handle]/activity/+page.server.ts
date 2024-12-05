import { formatTwiddles, getTwiddleSelect, getTwiddleWhere } from '$lib/models';
import { prisma } from '$lib/server/prisma';
import { isReadableByCurrentUser } from '@/lib/server/twiddle.js';

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
	const currentUserId = event.locals.session?.userId;

	const twiddlesPromise = isReadableByCurrentUser(profile, currentUserId)
		? []
		: getTwiddles(profile.id, currentUserId);

	return {
		twiddlesPromise
	};
};
