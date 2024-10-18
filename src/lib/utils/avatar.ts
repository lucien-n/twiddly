import {
	AVATAR_BACKGROUND_COLORS,
	getAvatarURLParams
} from '$lib/external/dicebear.notionists-neutral';
import { AvatarBackgroundColor, type Profile } from '@prisma/client';

const getAvatarBgColor = (bg: AvatarBackgroundColor | null) =>
	AVATAR_BACKGROUND_COLORS[bg ?? AvatarBackgroundColor.LAVENDER].replace('#', '');

export const getProfileAvatar = (profile: Pick<Profile, 'handle' | 'avatarBackgroundColor'>) =>
	'https://api.dicebear.com/9.x/notionists-neutral/svg?' +
	getAvatarURLParams({
		seed: profile.handle,
		backgroundColor: getAvatarBgColor(profile.avatarBackgroundColor)
	}).toString();
