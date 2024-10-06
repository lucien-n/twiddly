import { AvatarBackgroundColor, type Like, type Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import type { Post } from '$lib/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processPost = (post: any, currentUserId?: string): Post => ({
	id: post.id,
	content: post.content,
	likeCount: post.likeCount,
	liked: post.likes.some((like: Like) => like.profileId === currentUserId),
	edited: Boolean(post.editedAt),
	createdAt: post.createdAt,
	author: {
		id: post.author.id,
		handle: post.author.handle,
		displayName: post.author.displayName,
		avatarBackgroundColor: post.author.avatarBackgroundColor ?? AvatarBackgroundColor.LAVENDER,
		role: post.author.role
	}
});

export const getPosts = async (
	currentUserId?: string,
	where?: Prisma.PostWhereInput,
	orderBy?: Prisma.PostOrderByWithRelationInput
): Promise<Post[]> => {
	const posts = await prisma.post.findMany({
		orderBy: { createdAt: 'desc', ...orderBy },
		where: {
			deletedAt: null,
			author: {
				privacySettings: { private: { not: true } }
			},
			...where
		},
		select: {
			id: true,
			content: true,
			createdAt: true,
			likeCount: true,
			editedAt: true,
			likes: {
				select: { profileId: true },
				where: { profileId: currentUserId }
			},
			author: {
				select: {
					id: true,
					displayName: true,
					handle: true,
					role: true,
					avatarBackgroundColor: true
				}
			}
		}
	});

	const processed: Post[] = posts.map((post) => processPost(post, currentUserId));

	return processed;
};

export const getPostById = async (
	id: string,
	currentUserId?: string,
	where?: Prisma.PostWhereInput,
	orderBy?: Prisma.PostOrderByWithRelationInput
): Promise<Post> => {
	const post = await prisma.post.findFirst({
		orderBy: { createdAt: 'desc', ...orderBy },
		where: {
			deletedAt: null,
			author: {
				privacySettings: { private: { not: true } }
			},
			id,
			...where
		},
		select: {
			id: true,
			content: true,
			createdAt: true,
			likeCount: true,
			editedAt: true,
			likes: {
				select: { profileId: true },
				where: { profileId: currentUserId }
			},
			author: {
				select: {
					id: true,
					displayName: true,
					handle: true,
					role: true,
					avatarBackgroundColor: true
				}
			}
		}
	});

	return processPost(post, currentUserId);
};
