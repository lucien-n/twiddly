import { getProfileAvatar } from '$lib/utils/avatar';
import { AvatarBackgroundColor, type Follow, type Role } from '@prisma/client';

export interface Profile {
	id: string;
	bio: string;
	role: Role;
	avatar: string;
	handle: string;
	createdAt: Date;
	isPrivate: boolean;
	displayName: string;
	followingCount: number;
	followersCount: number;
	isFollowedByCurrentUser: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatProfile = (p: any, currentUserId?: string): Profile => ({
	id: p.id,
	bio: p.bio,
	role: p.role,
	handle: p.handle,
	avatar:
		p.handle && p.avatarBackgroundColor
			? getProfileAvatar(p)
			: getProfileAvatar({
					handle: 'unknown',
					avatarBackgroundColor: AvatarBackgroundColor.MISTYROSE
				}),
	createdAt: p.createdAt,
	displayName: p.displayName,
	isPrivate: Boolean(p.privacySettings?.private),
	followingCount: p.followingCount,
	followersCount: p.followersCount,
	isFollowedByCurrentUser: p.followers
		? (p as { followers: Follow[] }).followers.some(
				({ followerId }) => followerId === currentUserId
			)
		: false
});

export const getProfileSelect = (currentUserId?: string) => ({
	id: true,
	bio: true,
	role: true,
	handle: true,
	displayName: true,
	followingCount: true,
	followersCount: true,
	avatarBackgroundColor: true,
	privacySettings: { select: { private: true } },
	...(currentUserId ? { followers: { where: { followerId: currentUserId } } } : {})
});
