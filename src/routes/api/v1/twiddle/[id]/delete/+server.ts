import { prisma } from '$lib/server/prisma';
import { AuthErrorCode } from '$lib/utils/auth-error';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isAdmin, isVerified } from '$lib/server/auth';
import { dev } from '$app/environment';

export const POST: RequestHandler = async (event) => {
	if (!isVerified(event)) {
		return error(401, AuthErrorCode.AuthRequired);
	}

	const { userId } = event.locals.session;
	const { id: twiddleId } = event.params;
	try {
		const twiddle = await prisma.twiddle.update({
			data: { deletedAt: new Date() },
			where: {
				id: twiddleId,
				...(isAdmin(event) ? {} : { authorId: userId })
			},
			select: {
				parent: {
					select: {
						id: true
					}
				}
			}
		});

		if (twiddle.parent) {
			await prisma.twiddle.update({
				data: { commentCount: { increment: 1 } },
				where: { id: twiddle.parent.id }
			});
		}

		return json({ data: !!twiddle });
	} catch (e) {
		if (dev) {
			console.error(e);
		}

		return error(500, 'Could not delete twiddle');
	}
};
