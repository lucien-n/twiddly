import { AvatarBackgroundColor, type Role } from '@prisma/client';
import { getProfileAvatar } from '$lib/utils/avatar';

export interface Profile {
	id: string;
	bio: string;
	role: Role;
	avatar: string;
	handle: string;
	createdAt: Date;
	isPrivate: boolean;
	displayName: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatProfile = (p: any): Profile => ({
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
	isPrivate: Boolean(p.privacySettings?.private)
});

export const getProfileSelect = () => ({
	id: true,
	bio: true,
	role: true,
	handle: true,
	displayName: true,
	avatarBackgroundColor: true,
	privacySettings: { select: { private: true } }
});
