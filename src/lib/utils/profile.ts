import type { Prisma } from '@prisma/client';

export const getProfileSelect = (): Prisma.ProfileSelect => ({
	id: true,
	role: true,
	handle: true,
	displayName: true,
	avatarBackgroundColor: true,
	privacySettings: { select: { private: true } }
});
