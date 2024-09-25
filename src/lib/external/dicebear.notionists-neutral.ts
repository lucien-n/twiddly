import { AvatarBackgroundColor } from '@prisma/client';

export const AVATAR_BACKGROUND_COLOR_REGEX = /^(transparent|[a-fA-F0-9]{6})$/;

export const AVATAR_BACKGROUND_COLORS = {
	[AvatarBackgroundColor.LigthBlue]: '#b6e3f4',
	[AvatarBackgroundColor.Thistle]: '#c0aede',
	[AvatarBackgroundColor.Lavender]: '#d1d4f9',
	[AvatarBackgroundColor.Mistyrose]: '#ffd5dc',
	[AvatarBackgroundColor.Peach]: '#ffdfbf'
} as const;

export interface AvatarParams {
	seed?: string;
	backgroundColor?: AvatarBackgroundColor;
}
