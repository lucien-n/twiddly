import { prisma } from '$lib/server/prisma';
import { getTwiddleSelect, getTwiddleWhere } from '$lib/utils/twiddle';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const twiddlesPromise = prisma.twiddle.findMany({
		orderBy: { createdAt: 'desc' },
		select: getTwiddleSelect(event.locals.session?.userId),
		where: {
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

	return {
		twiddlesPromise
	};
};
