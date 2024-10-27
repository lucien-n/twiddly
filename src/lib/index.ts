import { AvatarBackgroundColor, type Role } from '@prisma/client';

export interface Twiddle {
	id: string;
	content: string;
	createdAt: Date;
	isEdited: boolean;
	author: {
		id: string;
		role: Role;
		handle: string;
		displayName: string;
		avatarBackgroundColor: AvatarBackgroundColor;
		isPrivate: boolean;
	};
	likeCount: number;
	isLiked: boolean;
	commentCount: number;
	comments?: Twiddle[];
	parent?: Twiddle;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatTwiddle = (t: any, currentUserId?: string) =>
	({
		id: t.id,
		content: t.content,
		createdAt: t.createdAt,
		parent: t.parent,
		isEdited: !!t.editedAt,
		likeCount: t.likeCount,
		commentCount: t.commentCount,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		comments: t.children?.map((comment: any) => formatTwiddle(comment, currentUserId)),
		isLiked: currentUserId
			? t.likes.some(({ profileId }: { profileId: string }) => profileId === currentUserId)
			: false,
		author: {
			id: t.author.id,
			role: t.author.role,
			handle: t.author.handle,
			displayName: t.author.displayName,
			avatarBackgroundColor: t.author.avatarBackgroundColor ?? AvatarBackgroundColor.LAVENDER,
			isPrivate: !!t.author.privacySettings?.private
		}
	}) satisfies Twiddle;
