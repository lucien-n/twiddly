import type { Like, Prisma } from '@prisma/client';
import { getProfileSelect } from './profile';

export const getPostSelect = (currentUserId?: string): Prisma.PostSelect => ({
	id: true,
	content: true,
	createdAt: true,
	likeCount: true,
	author: { select: getProfileSelect() },
	likes: { where: { profileId: currentUserId } }
});

export const isLiked = (
	currentUserId: string | undefined,
	likes: Pick<Like, 'profileId'>[]
): boolean => !!currentUserId && likes.some(({ profileId }) => currentUserId === profileId);
