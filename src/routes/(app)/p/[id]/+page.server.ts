import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const getPost = async (id: string) => {
	const post = await prisma.post.findFirst({ where: { id } });
	if (!post) {
		error(404, `Post "${id}" not found`);
	}

	return post;
};

export const load: PageServerLoad = async (event) => {
	const postPromise = getPost(event.params.id);

	return {
		postPromise
	};
};
