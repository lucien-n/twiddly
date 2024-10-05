import { prisma } from '$lib/server/prisma';
import { getPostSelect } from '$lib/utils/post';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => ({
	postPromise: prisma.post.findFirst({
		where: { id: event.params.postId, deleted: null },
		select: getPostSelect(event.locals.session?.userId)
	})
});
