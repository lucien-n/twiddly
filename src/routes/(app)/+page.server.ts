import { route } from '$lib/ROUTES';
import { createPostSchema } from '$lib/schemas/post/create-post';
import { prisma } from '$lib/server/prisma';
import { getPostSelect } from '$lib/utils/post';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const postsPromise = prisma.post.findMany({
		orderBy: { createdAt: 'desc' },
		select: getPostSelect(event.locals.session?.userId),
		where: {
			OR: [
				{ author: { privacySettings: { private: false } }, deleted: { not: true } },
				{ authorId: event.locals.session?.userId, deleted: { not: true } }
			]
		}
	});

	return {
		createPostForm: await superValidate(zod(createPostSchema)),
		postsPromise
	};
};

export const actions: Actions = {
	createPost: async (event) => {
		if (!event.locals.session) return fail(401);

		const form = await superValidate(event, zod(createPostSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { content } = form.data;

		const id = nanoid();
		const post = await prisma.post.create({
			data: { id, content, authorId: event.locals.session.userId },
			select: getPostSelect(event.locals.session.userId)
		});

		redirect(303, route('/[handle]/[postId]', { handle: post.author.handle, postId: id }));
	}
};
