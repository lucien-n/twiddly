import { prisma } from '$lib/server/prisma';
import { AuthCode } from '@/lib/utils/auth-code';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isVerified } from '$lib/server/auth';
import { dev } from '$app/environment';

export const POST: RequestHandler = async (event) => {
	if (!isVerified(event)) error(401, AuthCode.AuthRequired);

	const { id: twiddleId } = event.params;
	try {
		// check if the author's profile is private or the twiddle is deleted
		const isValid = !(await prisma.twiddle.findFirst({
			select: { id: true },
			where: {
				id: twiddleId,
				OR: [{ author: { privacySettings: { private: true } } }, { deletedAt: { not: null } }]
			}
		}));
		if (!isValid) throw 0;

		const result = await prisma.$transaction([
			prisma.like.create({
				data: {
					twiddleId,
					profileId: event.locals.session.userId
				}
			}),
			prisma.twiddle.update({
				data: { likeCount: { increment: 1 } },
				where: { id: twiddleId },
				select: { likeCount: true }
			})
		]);

		return json({ data: result[1].likeCount });
	} catch (e) {
		if (dev) {
			console.error(e);
		}

		error(500, 'Could not like twiddle');
	}
};
