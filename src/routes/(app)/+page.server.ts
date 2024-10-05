import { prisma } from '$lib/server/prisma';
import { getPostSelect } from '$lib/utils/post';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const postsPromise = prisma.post.findMany({
		orderBy: { createdAt: 'desc' },
		select: getPostSelect(event.locals.session?.userId),
		where: {
			OR: [
				{
					AND: [
						{ author: { privacySettings: { private: false } } },
						{ OR: [{ deleted: false }, { deleted: null }] }
					]
				},
				{
					AND: [
						{ authorId: event.locals.session?.userId },
						{ OR: [{ deleted: false }, { deleted: null }] }
					]
				}
			]
		}
	});

	return {
		postsPromise
	};
};
