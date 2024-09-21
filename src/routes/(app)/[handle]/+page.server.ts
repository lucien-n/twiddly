import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const getProfileAndPosts = async (handle: string) => {
	const profile = await prisma.profile.findFirst({ where: { handle } });
	if (!profile) error(404, `Profile @${handle} not found`);

	const posts = await prisma.post.findMany({
		where: { authorId: profile.id },
		take: 10
	});

	return { profile, posts: posts.map((post) => ({ ...post, author: profile })) };
};

export const load: PageServerLoad = async (event) => {
	const promise = getProfileAndPosts(event.params.handle);

	return {
		promise
	};
};
