import type { Profile } from '$lib/models';

export const isReadableByCurrentUser = (profile: Profile, currentUserId?: string) =>
	currentUserId === profile.id || profile.followStatus || !profile.isPrivate;
