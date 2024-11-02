import { PrismaClient } from '@prisma-app/client';

export const prisma = new PrismaClient(
	process.env.NODE_ENV === 'test'
		? {
				datasourceUrl: 'dont-touch-my-database'
			}
		: undefined
);

// todo: see — https://pris.ly/d/extensions
prisma.$use(async (params, next) => {
	if (params.model === 'Twiddle' && params.action === 'update') {
		params.args.data.editedAt = new Date();
	}

	return next(params);
});
