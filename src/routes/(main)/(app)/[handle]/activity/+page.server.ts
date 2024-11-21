import { formatTwiddles } from '$lib';
import { prisma } from '$lib/server/prisma';
import { getTwiddleSelect, getTwiddleWhere } from '$lib/utils/twiddle';

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
	const parent = await event.parent();

	return {
		twiddles: await getTwiddles(parent.profile?.id, event.locals.session?.userId)
	};
};
