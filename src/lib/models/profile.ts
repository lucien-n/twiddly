import { getProfileAvatar } from '$lib/utils/avatar';
import { AvatarBackgroundColor, FollowStatus, Role, type Follow } from '@prisma/client';

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
	currentUserFollowStatus: FollowStatus | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatProfile = (p: any, currentUserId?: string): Profile => ({
	id: p?.id ?? '',
	bio: p?.bio ?? '',
	role: p?.role ?? Role.RESTRICTED,
	handle: p?.handle ?? 'unknown',
	avatar: getProfileAvatar({
		handle: p.handle,
		avatarBackgroundColor: p?.avatarBackgroundColor ?? AvatarBackgroundColor.MISTYROSE
	}),
	createdAt: p?.createdAt || new Date(0),
	displayName: p?.displayName || 'Unknown',
	isPrivate: Boolean(p.privacySettings?.private),
	followingCount: p?.followingCount ?? 0,
	followersCount: p?.followersCount ?? 0,
	currentUserFollowStatus: p?.followers
		? (p as { followers: Follow[] }).followers.find(
				({ followerId }) => followerId === currentUserId
			)?.status
		: undefined
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
