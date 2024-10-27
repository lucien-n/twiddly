import { prisma } from '$lib/server/prisma';
import { AuthErrorCode } from '$lib/utils/auth-error';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isVerified } from '$lib/server/auth';

export const POST: RequestHandler = async (event) => {
	if (!isVerified(event)) return error(401, AuthErrorCode.AuthRequired);

	const { id: twiddleId } = event.params;
	try {
		const result = await prisma.twiddle.update({
			data: { deletedAt: new Date(), parent: { update: { commentCount: { decrement: 1 } } } },
			where: { id: twiddleId, authorId: event.locals.session.userId },
			select: {
				id: true // EMPTY SELECT
			}
		});

		return json({ data: !!result });
	} catch {
		return error(500, 'Could not delete twiddle');
	}
};
