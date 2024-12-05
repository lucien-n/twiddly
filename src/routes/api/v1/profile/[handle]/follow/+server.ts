import { dev } from '$app/environment';
import { updateFollowRequestSchema, type FollowAction } from '$lib/schemas/follow/update-request';
import { isVerified } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import { AuthCode } from '$lib/utils/auth-code';
import { ProfileCode } from '$lib/utils/profile-code';
import { FollowStatus } from '@prisma/client';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
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

		return json({ data: status });
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

		return json({ data: undefined });
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

	let action: FollowAction;
	const { handle } = event.params;
	try {
		const body = await event.request.json();
		const { success, data } = updateFollowRequestSchema.safeParse(body);

		if (!success || !data) {
			throw new Error();
		}

		action = data.action;
	} catch {
		return error(422, 'Invalid body');
	}

	const profile = await prisma.profile.findUnique({
		where: { handle },
		select: { id: true }
	});
	if (!profile) {
		return error(404, `Profile @${handle} not found`);
	}

	try {
		switch (action) {
			case 'APPROVE': {
				await prisma.follow.update({
					data: { status: FollowStatus.APPROVED },
					where: {
						followerId_followingId: {
							followerId: profile.id,
							followingId: event.locals.session.userId
						},
						status: FollowStatus.PENDING
					}
				});

				return json({ data: FollowStatus.APPROVED });
			}
			case 'REJECT': {
				await prisma.follow.delete({
					where: {
						followerId_followingId: {
							followerId: profile.id,
							followingId: event.locals.session.userId
						},
						status: FollowStatus.PENDING
					}
				});

				return json({ data: undefined });
			}
			case 'CANCEL': {
				await prisma.follow.delete({
					where: {
						followerId_followingId: {
							followerId: event.locals.session.userId,
							followingId: profile.id
						},
						status: FollowStatus.PENDING
					}
				});

				return json({ data: undefined });
			}
		}
	} catch (e) {
		if (dev) {
			console.error(e);
		}

		return error(500, 'An error occured');
	}
};
