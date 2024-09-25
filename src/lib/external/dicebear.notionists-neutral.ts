import { AvatarBackgroundColor } from '@prisma/client';

export const AVATAR_BACKGROUND_COLOR_REGEX = /^(transparent|[a-fA-F0-9]{6})$/;

export const AVATAR_BACKGROUND_COLORS = {
	[AvatarBackgroundColor.LIGTH_BLUE]: '#b6e3f4',
	[AvatarBackgroundColor.THISTLE]: '#c0aede',
	[AvatarBackgroundColor.LAVENDER]: '#d1d4f9',
	[AvatarBackgroundColor.MISTYROSE]: '#ffd5dc',
	[AvatarBackgroundColor.PEACH]: '#ffdfbf'
} as const;

export interface AvatarParams {
	seed?: string;
	backgroundColor?: AvatarBackgroundColor;
}
