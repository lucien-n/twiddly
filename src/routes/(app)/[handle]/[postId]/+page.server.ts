import { prisma } from '$lib/server/prisma';
import { postSelect } from '$lib/utils/post';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	return {
		postPromise: prisma.post.findFirst({ where: { id: event.params.postId }, select: postSelect })
	};
};
