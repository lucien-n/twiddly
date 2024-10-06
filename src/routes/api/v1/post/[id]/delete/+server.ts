import { prisma } from '$lib/server/prisma';
import { AuthErrorCode } from '$lib/utils/auth-error';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	if (!event.locals.session) return error(401, AuthErrorCode.AuthRequired);

	const { id: postId } = event.params;
	try {
		const result = await prisma.post.update({
			data: { deletedAt: new Date() },
			where: { id: postId, authorId: event.locals.session.userId },
			select: {
				id: true // EMPTY SELECT
			}
		});

		return json({ data: !!result });
	} catch {
		return error(500, 'Could not delete post');
	}
};
