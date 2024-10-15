import { vi } from 'vitest';

export const mTransaction = vi.fn();
export const mUserFindFirst = vi.fn();
export const mUserCreate = vi.fn();
export const mProfileFindFirst = vi.fn();
export const mEmailVerificationCodeDeleteMany = vi.fn();
export const mEmailVerificationCodeCreate = vi.fn();
export const mEmailVerificationCodeFindFirst = vi.fn();
export const mEmailVerificationCodeDelete = vi.fn();
export const mHandleBlacklistFindFirst = vi.fn();

vi.mock('$lib/server/prisma', () => ({
	prisma: {
		$transaction: mTransaction,
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
		},
		handleBlacklist: {
			findFirst: mHandleBlacklistFindFirst
		}
	}
}));
