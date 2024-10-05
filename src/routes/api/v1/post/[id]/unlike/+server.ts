import { prisma } from '$lib/server/prisma';
import { AuthErrorCode } from '$lib/utils/auth-error';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	if (!event.locals.session) return error(401, AuthErrorCode.AuthRequired);

	const { id: postId } = event.params;
	try {
		// should we block unlikes if the author's profile is private
		// should we block unlikes if the post is marked as deleted
		const result = await prisma.$transaction([
			prisma.like.delete({
				where: {
					postId_profileId: {
						postId,
						profileId: event.locals.session.userId
					}
				}
			}),
			prisma.post.update({
				data: { likeCount: { decrement: 1 } },
				where: { id: postId },
				select: { likeCount: true }
			})
		]);

		return json({ data: result[1].likeCount });
	} catch {
		return error(500, 'Could not like post');
	}
};
