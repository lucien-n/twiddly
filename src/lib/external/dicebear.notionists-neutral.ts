import { AvatarBackgroundColor } from '@prisma/client';

export const AVATAR_BACKGROUND_COLOR_REGEX = /^(transparent|[a-fA-F0-9]{6})$/;

export const AVATAR_BACKGROUND_COLORS = {
	[AvatarBackgroundColor.LIGTH_BLUE]: '#86c9e1',
	[AvatarBackgroundColor.THISTLE]: '#9d87c2',
	[AvatarBackgroundColor.LAVENDER]: '#a6a7e8',
	[AvatarBackgroundColor.MISTYROSE]: '#f5a3aa',
	[AvatarBackgroundColor.PEACH]: '#f5c08f',
	[AvatarBackgroundColor.LIME]: '#b3d89f'
} as const;

export interface AvatarParams {
	seed?: string;
	backgroundColor?: AvatarBackgroundColor;
}
