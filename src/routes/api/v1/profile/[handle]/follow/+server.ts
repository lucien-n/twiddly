import { dev } from '$app/environment';
import { isVerified } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import { AuthCode } from '@/lib/utils/auth-code';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ProfileCode } from '$lib/utils/profile-code';

export const POST: RequestHandler = async (event) => {
	if (!isVerified(event)) {
		error(401, AuthCode.AuthRequired);
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
			throw ProfileCode.NotFound;
		}
		if (profile?.privacySettings?.private) {
			throw ProfileCode.Private;
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

		switch (e) {
			case ProfileCode.NotFound:
				return error(404, `Profile @${handle} not found`);
			case ProfileCode.Private:
				return error(401, `Profile @${handle} is private`);
			default:
				error(500, `Could not follow profile @${handle}`);
		}
	}
};

export const DELETE: RequestHandler = async (event) => {
	if (!isVerified(event)) {
		error(401, AuthCode.AuthRequired);
	}

	const { handle } = event.params;
	try {
		const followerId = event.locals.session.userId;
		const profile = await prisma.profile.findFirst({
			where: { handle, user: { deletedAt: null }, followers: { some: { followerId } } },
			select: {
				id: true
			}
		});
		if (!profile) {
			throw ProfileCode.NotFound;
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

		switch (e) {
			case ProfileCode.NotFound:
				return error(404, `Profile @${handle} neither found or followed`);
			default:
				error(500, `Could not unfollow profile @${handle}`);
		}
	}
};
