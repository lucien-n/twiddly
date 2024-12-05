import { dev } from '$app/environment';
import { isVerified } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import { ProfileCode } from '$lib/utils/profile-code';
import { AuthCode } from '$lib/utils/auth-code';
import { FollowStatus } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateFollowRequestSchema, type FollowAction } from '$lib/schemas/follow/update-request';
import { FollowCode } from '$lib/utils/follow-code';
import { getDecrementFollowCountsActions, getIncrementFollowCountsActions } from './helpers';

export const POST: RequestHandler = async (event) => {
	if (!isVerified(event)) {
		return error(401, AuthCode.AuthRequired);
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

		const followerId = event.locals.session.userId;
		const followingId = profile.id;

		const isFollowingPrivate = !!profile.privacySettings?.private;
		const status = isFollowingPrivate ? FollowStatus.PENDING : FollowStatus.APPROVED;

		await prisma.$transaction([
			prisma.follow.create({
				data: {
					followerId,
					followingId,
					status
				}
			}),
			...(status === FollowStatus.APPROVED
				? getIncrementFollowCountsActions(followerId, followingId)
				: [])
		]);

		return new Response();
	} catch (e) {
		if (dev) {
			console.error(e);
		}

		switch (e) {
			case ProfileCode.NotFound:
				return error(404, `Profile @${handle} not found`);
			default:
				return error(500, `Could not follow profile @${handle}`);
		}
	}
};

export const DELETE: RequestHandler = async (event) => {
	if (!isVerified(event)) {
		return error(401, AuthCode.AuthRequired);
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
			...getDecrementFollowCountsActions(followerId, followingId)
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
				return error(500, `Could not unfollow profile @${handle}`);
		}
	}
};

export const PUT: RequestHandler = async (event) => {
	if (!isVerified(event)) {
		return error(401, AuthCode.AuthRequired);
	}

	if (!event.request.bodyUsed) {
		return error(422, 'Missing body');
	}

	let action: FollowAction;
	try {
		const body = await event.request.json();
		const result = updateFollowRequestSchema.parse(body);
		action = result.action;
	} catch {
		return error(422, 'Invalid body');
	}

	const { handle } = event.params;
	try {
		const profile = await prisma.profile.findFirst({
			where: { handle, user: { deletedAt: null } },
			select: {
				id: true
			}
		});
		if (!profile) {
			throw ProfileCode.NotFound;
		}

		const followerId = event.locals.session.userId;
		const followingId = profile.id;
		const followerId_followingId = {
			followerId,
			followingId
		};
		const follow = await prisma.follow.findUnique({
			where: { followerId_followingId }
		});
		if (!follow) {
			throw FollowCode.RequestNotFound;
		}

		switch (action) {
			case 'CANCEL': {
				await prisma.follow.delete({ where: { followerId_followingId } });
				break;
			}
			case 'APPROVE': {
				await prisma.$transaction([
					prisma.follow.update({
						data: { status: FollowStatus.APPROVED },
						where: { followerId_followingId }
					}),
					...getIncrementFollowCountsActions(followerId, followingId)
				]);
				break;
			}
		}

		return new Response();
	} catch (e) {
		if (dev) {
			console.error(e);
		}

		switch (e) {
			case ProfileCode.NotFound:
				return error(404, `Profile @${handle} not found`);
			case FollowCode.RequestNotFound:
				return error(404, 'Could not find follow request');
			default:
				return error(
					500,
					`Could not ${action === 'APPROVE' ? 'approve' : 'reject'} follow request`
				);
		}
	}
};
