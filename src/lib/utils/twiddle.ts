import type { Like, Prisma } from '@prisma/client';
import { getProfileSelect } from './profile';

export const isLiked = (
	currentUserId: string | undefined,
	likes: Pick<Like, 'profileId'>[]
): boolean => !!currentUserId && likes.some(({ profileId }) => currentUserId === profileId);

export const getTwiddleSelect = (currentUserId?: string): Prisma.TwiddleSelect => ({
	id: true,
	editedAt: true,
	content: true,
	createdAt: true,
	likeCount: true,
	author: { select: getProfileSelect() },
	likes: { where: { profileId: currentUserId } }
});

export const getTwiddleOrderBy = (
	orderBy?: Prisma.TwiddleOrderByWithRelationInput
): Prisma.TwiddleOrderByWithRelationInput => ({
	createdAt: 'desc',
	...orderBy
});

export const getTwiddleWhere = (where?: Prisma.TwiddleWhereInput): Prisma.TwiddleWhereInput => ({
	deletedAt: null,
	...where
});
