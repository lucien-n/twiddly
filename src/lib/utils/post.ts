import type { Prisma } from '@prisma/client';

export const postSelect: Prisma.PostSelect = {
	id: true,
	content: true,
	createdAt: true,
	author: { select: { id: true, displayName: true, handle: true } }
};
