import { AvatarBackgroundColor } from '@prisma/client';

export const AVATAR_BACKGROUND_COLORS = {
	[AvatarBackgroundColor.LIGTH_BLUE]: '#86c9e1',
	[AvatarBackgroundColor.THISTLE]: '#9d87c2',
	[AvatarBackgroundColor.LAVENDER]: '#a6a7e8',
	[AvatarBackgroundColor.MISTYROSE]: '#f5a3aa',
	[AvatarBackgroundColor.PEACH]: '#f5c08f',
	[AvatarBackgroundColor.LIME]: '#b3d89f'
} as const;

type AvatarBackgroundColorParam = 'transparent' | string;

export interface AvatarParams {
	seed?: string | number;
	backgroundColor?: AvatarBackgroundColorParam | AvatarBackgroundColorParam[];
	backgroundType?: 'gradientLinear' | 'solid';
	backgroundRotation?: number;
}

export const getAvatarURLParams = (params: AvatarParams): URLSearchParams => {
	const formattedParams: Record<string, string> = {};

	if (params.seed) formattedParams.seed = params.seed.toString();
	if (params.backgroundType) formattedParams.backgroundType = params.backgroundType;
	if (params.backgroundRotation)
		formattedParams.backgroundRotation = params.backgroundRotation.toString();

	if (params.backgroundColor)
		formattedParams.backgroundColor =
			typeof params.backgroundColor === 'string'
				? params.backgroundColor
				: params.backgroundColor.join(',');

	return new URLSearchParams(formattedParams);
};
