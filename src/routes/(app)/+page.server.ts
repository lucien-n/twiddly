import { formatTwiddle } from '$lib';
import { prisma } from '$lib/server/prisma';
import { getTwiddleSelect, getTwiddleWhere } from '$lib/utils/twiddle';
import type { PageServerLoad } from './$types';

const getTwiddles = async (currentUserId?: string) => {
	const twiddles = await prisma.twiddle.findMany({
		orderBy: { createdAt: 'desc' },
		select: getTwiddleSelect(currentUserId),
		where: {
			author: { user: { deletedAt: null } },
			parent: null,
			OR: [
				{
					AND: [{ author: { privacySettings: { private: false } } }, getTwiddleWhere()]
				},
				{
					AND: [{ authorId: currentUserId }, getTwiddleWhere()]
				}
			]
		}
	});

	return twiddles.map((t) => formatTwiddle(t, currentUserId));
};

export const load: PageServerLoad = async (event) => ({
	twiddles: await getTwiddles(event.locals.session?.userId)
});
