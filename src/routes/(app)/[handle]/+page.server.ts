import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPostSelect } from '$lib/utils/post';

export const load: PageServerLoad = async (event) => {
	const { handle } = event.params;

	const profile = await prisma.profile.findFirst({
		where: { handle },
		select: {
			id: true,
			handle: true,
			displayName: true,
			privacySettings: { select: { private: true } }
		}
	});
	if (!profile) error(404, `Profile @${handle} not found`);
	if (profile.privacySettings?.private && profile.id !== event.locals.session?.userId)
		error(401, `@${handle}'s profile is private`);

	const postsPromise = prisma.post
		.findMany({
			where: { authorId: profile.id, deleted: { not: true } },
			select: getPostSelect(event.locals.session?.userId),
			take: 10
		})
		.then((posts) => posts.map((post) => ({ ...post, author: profile })));

	return {
		profile,
		postsPromise
	};
};
