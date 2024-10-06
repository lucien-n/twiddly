import { prisma } from '$lib/server/prisma';
import { getPostSelect, getPostWhere } from '$lib/utils/post';
import type { PublicPost } from '@/post';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => ({
	postPromise: prisma.post.findFirst({
		where: { id: event.params.postId, ...getPostWhere() },
		select: getPostSelect(event.locals.session?.userId)
	}) as Promise<PublicPost>
});
