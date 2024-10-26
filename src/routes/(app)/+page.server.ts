import { prisma } from '$lib/server/prisma';
import { getTwiddleSelect, getTwiddleWhere } from '$lib/utils/twiddle';
import type { TwiddleData } from '@/twiddle';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const twiddles = await prisma.twiddle.findMany({
		orderBy: { createdAt: 'desc' },
		select: getTwiddleSelect(event.locals.session?.userId),
		where: {
			author: { user: { deletedAt: null } },
			OR: [
				{
					AND: [{ author: { privacySettings: { private: false } } }, getTwiddleWhere()]
				},
				{
					AND: [{ authorId: event.locals.session?.userId }, getTwiddleWhere()]
				}
			]
		}
	});

	// todo: rework
	return {
		twiddles: twiddles as unknown as TwiddleData[]
	};
};
