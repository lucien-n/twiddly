import { route } from '$lib/ROUTES';
import { createPostSchema } from '$lib/schemas/post/create-post';
import { prisma } from '$lib/server/prisma';
import { postSelect } from '$lib/utils/post';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const postsPromise = prisma.post.findMany({
		orderBy: { createdAt: 'desc' },
		select: postSelect
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
			select: postSelect
		});

		redirect(303, route('/[handle]/[postId]', { handle: post.author.handle, postId: id }));
	}
};
