import { prisma } from '@/lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const users = await prisma.user.findMany({ include: { profile: true, _count: true } });

	return {
		users
	};
};
