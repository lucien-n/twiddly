import { prisma } from '@/lib/server/prisma';
import type { PageServerLoad } from './$types';
import type { DataUser } from './types';

export const load: PageServerLoad = async () => {
	const users = await prisma.user.findMany({
		select: {
			id: true,
			createdAt: true,
			deletedAt: true,
			updatedAt: true,
			email: true,
			emailVerified: true,
			profile: {
				select: { handle: true, displayName: true, role: true }
			}
		}
	});

	return {
		users: users.map(({ profile, ...user }) => ({
			...user,
			...profile
		})) as DataUser[]
	};
};
