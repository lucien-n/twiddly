import { dev } from '$app/environment';
import { setPostSchema } from '$lib/schemas/post/set-post';
import { prisma } from '$lib/server/prisma';
import { error, fail, type Action } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const setPost: Action = async (event) => {
	if (!event.locals.session) return fail(401);

	const form = await superValidate(event, zod(setPostSchema));
	if (!form.valid) {
		return fail(400, { form });
	}

	try {
		const { id, content } = form.data;

		if (id) {
			await prisma.post.update({
				data: { content },
				where: { id, authorId: event.locals.session.userId },
				select: {
					id: true // EMPTY QUERY
				}
			});
		} else {
			await prisma.post.create({
				data: { id: nanoid(), content, authorId: event.locals.session.userId },
				select: {
					id: true // EMPTY QUERY
				}
			});
		}
	} catch (e) {
		if (dev) console.error(e);

		return error(500, { message: 'An error occured' });
	}

	return {
		setPostForm: form
	};
};
