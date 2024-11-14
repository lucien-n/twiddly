import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient(
	process.env.NODE_ENV === 'test'
		? {
				datasourceUrl: 'dont-touch-my-database'
			}
		: undefined
);
