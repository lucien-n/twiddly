import { vi } from 'vitest';

export const mUserFindFirst = vi.fn();
export const mUserCreate = vi.fn();
export const mProfileFindFirst = vi.fn();

vi.mock('../../src/lib/server/prisma', () => ({
	prisma: {
		user: {
			findFirst: mUserFindFirst,
			create: mUserCreate
		},
		profile: {
			findFirst: mProfileFindFirst
		}
	}
}));
