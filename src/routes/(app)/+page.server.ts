import { createPostSchema } from '$lib/schemas/post/create-post';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { nanoid } from 'nanoid';
import { route } from '$lib/ROUTES';

export const load: PageServerLoad = async () => {
	const postsPromise = prisma.post.findMany({ orderBy: { createdAt: 'desc' } });

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
		await prisma.post.create({
			data: { id, content, authorId: event.locals.session.userId }
		});

		redirect(
			303,
			route('/[profileId]/[postId]', { profileId: event.locals.session.userId, postId: id })
		);
	}
};
