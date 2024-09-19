import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { postSelect } from '$lib/utils/post';

const getPost = async (id: string) => {
	const post = await prisma.post.findFirst({ where: { id }, select: postSelect });
	if (!post) {
		error(404, `Post "${id}" not found`);
	}

	return post;
};

export const load: PageServerLoad = async (event) => {
	const postPromise = getPost(event.params.postId);

	return {
		postPromise
	};
};
