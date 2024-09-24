import { prisma } from '$lib/server/prisma';
import { AuthErrorCode } from '$lib/utils/auth-error';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	if (!event.locals.session) return error(401, AuthErrorCode.AuthRequired);

	const { id: postId } = event.params;
	try {
		// should we block likes if the author's profile is private
		const result = await prisma.$transaction([
			prisma.like.create({
				data: {
					postId,
					profileId: event.locals.session.userId
				}
			}),
			prisma.post.update({
				where: { id: postId },
				data: { likeCount: { increment: 1 } }
			})
		]);

		return json({ data: result[1].likeCount });
	} catch {
		return error(500, 'Could not like post');
	}
};