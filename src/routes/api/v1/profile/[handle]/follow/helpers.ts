import { prisma } from '$lib/server/prisma';

export const getIncrementFollowCountsActions = (followerId: string, followingId: string) => [
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
];

export const getDecrementFollowCountsActions = (followerId: string, followingId: string) => [
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
];
