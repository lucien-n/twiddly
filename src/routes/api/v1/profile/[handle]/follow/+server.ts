import { dev } from '$app/environment';
import { isVerified } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import { AuthErrorCode } from '$lib/utils/auth-error';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	if (!isVerified(event)) {
		error(401, AuthErrorCode.AuthRequired);
	}

	const { handle } = event.params;
	try {
		const profile = await prisma.profile.findFirst({
			where: { handle, user: { deletedAt: null } },
			select: {
				id: true,
				privacySettings: {
					select: {
						private: true
					}
				}
			}
		});
		if (!profile) {
			error(404, `Profile @${handle} not found`);
		}
		if (profile?.privacySettings?.private) {
			error(401, `Profile @${handle} is private`);
		}

		const followerId = event.locals.session.userId;
		const followingId = profile.id;

		await prisma.$transaction([
			prisma.follow.create({
				data: {
					followerId,
					followingId
				}
			}),
			prisma.profile.update({
				data: { followingCount: { increment: 1 } },
				where: { id: followerId },
				select: {
					id: true // EMPTY SELECT
				}
			}),
			prisma.profile.update({
				data: { followersCount: { increment: 1 } },
				where: { id: followingId },
				select: {
					id: true // EMPTY SELECT
				}
			})
		]);

		return new Response();
	} catch (e) {
		if (dev) {
			console.error(e);
		}

		error(500, `Could not follow profile @${handle}`);
	}
};

export const DELETE: RequestHandler = async (event) => {
	if (!isVerified(event)) {
		error(401, AuthErrorCode.AuthRequired);
	}

	const { handle } = event.params;
	try {
		const followerId = event.locals.session.userId;
		const profile = await prisma.profile.findFirst({
			where: { handle, user: { deletedAt: null }, followers: { some: { followerId } } },
			select: {
				id: true,
				privacySettings: {
					select: {
						private: true
					}
				}
			}
		});
		if (!profile) {
			error(404, `Profile @${handle} neither found or followed`);
		}

		const followingId = profile.id;

		await prisma.$transaction([
			prisma.follow.delete({
				where: {
					followerId_followingId: {
						followerId,
						followingId
					}
				}
			}),
			prisma.profile.update({
				data: { followingCount: { decrement: 1 } },
				where: { id: followerId },
				select: {
					id: true // EMPTY SELECT
				}
			}),
			prisma.profile.update({
				data: { followersCount: { decrement: 1 } },
				where: { id: followingId },
				select: {
					id: true // EMPTY SELECT
				}
			})
		]);

		return new Response();
	} catch (e) {
		if (dev) {
			console.error(e);
		}

		error(500, `Could not follow profile @${handle}`);
	}
};
