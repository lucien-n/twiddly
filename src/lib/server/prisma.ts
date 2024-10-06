import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// todo: see — https://pris.ly/d/extensions
prisma.$use(async (params, next) => {
	if (params.model === 'Post' && params.action === 'update') {
		if (!params.args.data.deleted) params.args.data.edited = true;
	}

	return next(params);
});
