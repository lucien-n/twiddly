import { vi } from 'vitest';

export const mUserFindFirst = vi.fn();
export const mUserCreate = vi.fn();
export const mProfileFindFirst = vi.fn();
export const mEmailVerificationCodeDeleteMany = vi.fn();
export const mEmailVerificationCodeCreate = vi.fn();
export const mEmailVerificationCodeFindFirst = vi.fn();
export const mEmailVerificationCodeDelete = vi.fn();

vi.mock('../../src/lib/server/prisma', () => ({
	prisma: {
		user: {
			findFirst: mUserFindFirst,
			create: mUserCreate
		},
		profile: {
			findFirst: mProfileFindFirst
		},
		emailVerificationCode: {
			deleteMany: mEmailVerificationCodeDeleteMany,
			create: mEmailVerificationCodeCreate,
			findFirst: mEmailVerificationCodeFindFirst,
			delete: mEmailVerificationCodeDelete
		}
	}
}));
