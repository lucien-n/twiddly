import type { AvatarBackgroundColor, Role } from '@prisma/client';

export type Post = {
	id: string;
	content: string;
	likeCount: number;
	liked: boolean;
	edited: boolean;
	createdAt: Date;
	author: {
		id: string;
		handle: string;
		displayName: string;
		avatarBackgroundColor: AvatarBackgroundColor;
		role: Role;
	};
};

export type Profile = {
	id: string;
	handle: string;
	displayName: string;
	avatarBackgroundColor: AvatarBackgroundColor; // transform avatar options into url params / object ?
	role: Role;
};
