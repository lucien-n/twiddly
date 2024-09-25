import type { Prisma } from '@prisma/client';

export const getProfileSelect = (): Prisma.ProfileSelect => ({
	id: true,
	handle: true,
	displayName: true,
	avatarBackgroundColor: true,
	privacySettings: { select: { private: true } }
});
