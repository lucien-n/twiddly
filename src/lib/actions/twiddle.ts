import { dev } from '$app/environment';
import { route } from '$lib/ROUTES';
import { setTwiddleSchema } from '$lib/schemas/twiddle/set-twiddle';
import { isVerified } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import { error, fail, isRedirect, redirect, type Action } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const setTwiddle: Action = async (event) => {
	if (!isVerified(event)) return fail(401);

	const setTwiddleForm = await superValidate(event, zod(setTwiddleSchema));
	if (!setTwiddleForm.valid) {
		return fail(400, { setTwiddleForm });
	}

	try {
		const { data } = setTwiddleForm;
		const { id, parentId } = data;
		// primitive formatting
		const content = data.content.trimEnd();

		if (id) {
			await prisma.twiddle.update({
				data: { content },
				where: { id, authorId: event.locals.session.userId },
				select: {
					id: true // EMPTY SELECT
				}
			});

			return { setTwiddleForm };
		}

		if (parentId) {
			await prisma.$transaction([
				prisma.twiddle.create({
					data: {
						id: nanoid(),
						content,
						authorId: event.locals.session.userId,
						parentId
					},

					select: {
						id: true // EMPTY SELECT
					}
				}),
				prisma.twiddle.update({ where: { id: parentId }, data: { commentCount: { increment: 1 } } })
			]);

			return { setTwiddleForm };
		}

		const twiddle = await prisma.twiddle.create({
			data: { id: nanoid(), content, authorId: event.locals.session.userId },
			select: {
				id: true,
				author: {
					select: {
						handle: true
					}
				}
			}
		});

		redirect(
			303,
			route('/[handle]/[twiddleId]', { handle: twiddle.author.handle, twiddleId: twiddle.id })
		);
	} catch (e) {
		if (dev) console.error(e);

		if (isRedirect(e)) redirect(e.status, e.location);

		return error(500, { message: 'An error occured' });
	}
};
