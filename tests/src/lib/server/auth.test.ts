import { mGetMaintenanceMode } from '$tests/mocks/utils';
import { mSendOTPVerificationEmail } from '$tests/mocks/email';
import {
	mCreateBlankSessionCookie,
	mCreateSession,
	mCreateSessionCookie,
	mSessionCookieName,
	mValidateSession
} from '$tests/mocks/lucia';
import {
	mEmailVerificationCodeCreate,
	mEmailVerificationCodeDelete,
	mEmailVerificationCodeDeleteMany,
	mEmailVerificationCodeFindFirst,
	mHandleBlacklistFindFirst,
	mProfileFindFirst,
	mTransaction,
	mUserCreate,
	mUserFindFirst
} from '$tests/mocks/prisma';
import {
	checkHandle,
	hashPassword,
	isAdmin,
	isAuthenticated,
	isRestricted,
	isVerified,
	refreshSession,
	signInWithEmailAndPassword,
	signUpWithEmailAndPassword,
	verifyPassword,
	verifyVerificationCode
} from '$lib/server/auth';
import { AuthError, AuthErrorCode } from '$lib/utils/auth-error';
import { relationalEmailVerificationCodeFixtureA } from '$tests/fixtures/emailVerificationCode';
import { baseProfileFixtureA } from '$tests/fixtures/profile';
import { baseSessionFixtureA } from '$tests/fixtures/session';
import { baseUserFixtureA, baseUserFixtureB } from '$tests/fixtures/user';
import type { RequestEvent } from '@sveltejs/kit';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MaintenanceMode, Role } from '@prisma/client';

const mPassword = 'password';
const mHashedPassword =
	'$argon2id$v=19$m=19456,t=2,p=1$NpDqOwIw8x/YWcct0OuomA$LqJv3svMkTHLmp1P6zsP24uyHK1tce7Ri6pr5YPwYuc';

const mCookiesSet = vi.fn();
const mCookiesGet = vi.fn();
const mRequestEvent = {
	cookies: { set: mCookiesSet, get: mCookiesGet },
	locals: {}
} as unknown as RequestEvent;

vi.mock('$app/environment', () => ({ dev: false }));

describe('auth', () => {
	beforeEach(() => {
		vi.resetAllMocks();

		mSendOTPVerificationEmail.mockResolvedValue(true);
		mTransaction.mockResolvedValue([null, null]);
		mGetMaintenanceMode.mockReturnValue(MaintenanceMode.OPEN);
		mCreateSession.mockResolvedValue(baseSessionFixtureA);
		mCreateSessionCookie.mockResolvedValue({
			cookieName: mSessionCookieName
		});
	});

	describe('hashPassword', () => {
		it('should hash a password correctly', async () => {
			const hashedPassword = await hashPassword(mPassword);
			expect(hashedPassword).toBeDefined();
		});
	});

	describe('verifyPassword', () => {
		it('should verify a password correctly', async () => {
			const result = await verifyPassword(mPassword, mHashedPassword);
			expect(result).toBe(true);
		});

		it('should reject invalid password', async () => {
			const result = await verifyPassword('wrong-password', mHashedPassword);
			expect(result).toBe(false);
		});
	});

	describe('signUpWithEmailAndPassword', () => {
		it('should sign up a new user with valid email and password', async () => {
			mProfileFindFirst.mockResolvedValue(null);
			mUserFindFirst.mockResolvedValue(null);
			mUserCreate.mockResolvedValue(baseUserFixtureA);

			const result = await signUpWithEmailAndPassword(
				mRequestEvent,
				baseUserFixtureA.email,
				mPassword,
				{
					displayName: baseProfileFixtureA.displayName,
					handle: baseProfileFixtureA.handle
				}
			);

			expect(result).toBeDefined();
			expect(mProfileFindFirst).toHaveBeenCalledTimes(1);
			expect(mProfileFindFirst).toHaveBeenCalledWith({
				where: { handle: baseProfileFixtureA.handle },
				select: { id: true }
			});
			expect(mUserFindFirst).toHaveBeenCalledTimes(1);
			expect(mUserFindFirst).toHaveBeenCalledWith({ where: { email: baseUserFixtureA.email } });
			expect(mUserCreate).toHaveBeenCalledTimes(1);
			expect(mCreateSession).toHaveBeenCalledTimes(1);
			expect(mEmailVerificationCodeDeleteMany).toHaveBeenCalledTimes(1);
			expect(mEmailVerificationCodeDeleteMany).toHaveBeenCalledWith({
				where: { userId: expect.any(String) }
			});
			expect(mEmailVerificationCodeCreate).toHaveBeenCalledTimes(1);
			expect(mEmailVerificationCodeCreate).toHaveBeenCalledWith({
				data: {
					userId: expect.any(String),
					email: baseUserFixtureA.email,
					code: expect.any(String),
					expiresAt: expect.any(Date)
				}
			});
			expect(mSendOTPVerificationEmail).toHaveBeenCalledTimes(1);
			expect(mSendOTPVerificationEmail).toHaveBeenCalledWith(expect.any(String), {
				email: baseUserFixtureA.email,
				name: baseProfileFixtureA.displayName
			});
		});

		it('should throw error if email is already in use', async () => {
			mUserFindFirst.mockResolvedValue(baseUserFixtureA);

			await expect(
				signUpWithEmailAndPassword(mRequestEvent, baseUserFixtureA.email, mPassword, {
					displayName: baseProfileFixtureA.displayName,
					handle: 'differenthandle'
				})
			).rejects.toThrowError(new AuthError(AuthErrorCode.EmailAlreadyInUse));
		});

		it('should throw error if handle is already in use', async () => {
			mTransaction.mockResolvedValue([null, { id: baseUserFixtureA.id }]);

			await expect(
				signUpWithEmailAndPassword(mRequestEvent, 'different@mail.com', mPassword, {
					displayName: baseProfileFixtureA.displayName,
					handle: baseProfileFixtureA.handle
				})
			).rejects.toThrowError(new AuthError(AuthErrorCode.HandleAlreadyInUse));
		});

		it('should throw error if handle is invalid (non regex compliant)', async () => {
			await expect(
				signUpWithEmailAndPassword(mRequestEvent, 'different@mail.com', mPassword, {
					displayName: baseProfileFixtureA.displayName,
					handle: 'handle with spaces'
				})
			).rejects.toThrowError(new AuthError(AuthErrorCode.InvalidHandle));
		});

		it('should throw error if handle is invalid (in hardcoded blacklist)', async () => {
			await expect(
				signUpWithEmailAndPassword(mRequestEvent, 'different@mail.com', mPassword, {
					displayName: baseProfileFixtureA.displayName,
					handle: 'verify'
				})
			).rejects.toThrowError(new AuthError(AuthErrorCode.InvalidHandle));
		});

		it('should throw error if handle is invalid (in db blacklist)', async () => {
			const mHandle = 'blacklistedHandle';
			mTransaction.mockResolvedValue([{ handle: mHandle }, null]);

			await expect(
				signUpWithEmailAndPassword(mRequestEvent, 'different@mail.com', mPassword, {
					displayName: baseProfileFixtureA.displayName,
					handle: mHandle
				})
			).rejects.toThrowError(new AuthError(AuthErrorCode.InvalidHandle));
		});

		it('should throw error if email could not be sent', async () => {
			mProfileFindFirst.mockResolvedValue(null);
			mUserFindFirst.mockResolvedValue(null);
			mUserCreate.mockResolvedValue(baseUserFixtureA);
			mSendOTPVerificationEmail.mockResolvedValue(false);

			await expect(
				signUpWithEmailAndPassword(mRequestEvent, baseUserFixtureA.email, mPassword, {
					displayName: baseProfileFixtureA.displayName,
					handle: baseProfileFixtureA.handle
				})
			).rejects.toThrowError(new Error('Could not send verification code email'));
		});

		it('should not be able to sign up if maintenance mode is not open', async () => {
			mGetMaintenanceMode.mockReturnValue(MaintenanceMode.VERIFIED);

			await expect(
				signUpWithEmailAndPassword(mRequestEvent, baseUserFixtureA.email, mPassword, {
					displayName: baseProfileFixtureA.displayName,
					handle: baseProfileFixtureA.handle
				})
			).rejects.toThrowError(new AuthError(AuthErrorCode.Unauthorized));
		});
	});

	describe('signInWithEmailAndPassword', () => {
		it('should sign in an existing user with valid credentials', async () => {
			mUserFindFirst.mockResolvedValue(baseUserFixtureA);

			await signInWithEmailAndPassword(mRequestEvent, baseUserFixtureA.email, mPassword);

			expect(mCreateSession).toHaveBeenCalledTimes(1);
			expect(mCookiesSet).toHaveBeenCalledTimes(1);
		});

		it('should throw error if invalid credentials are provided', async () => {
			mUserFindFirst.mockResolvedValue(null);

			await expect(
				signInWithEmailAndPassword(mRequestEvent, 'invalid@mail.com', mPassword)
			).rejects.toThrowError(new AuthError(AuthErrorCode.InvalidCredentials));
		});

		it('should throw error if password verification fails', async () => {
			mUserFindFirst.mockResolvedValue(baseUserFixtureA);

			await expect(
				signInWithEmailAndPassword(mRequestEvent, baseUserFixtureA.email, 'wrong-password')
			).rejects.toThrowError(new AuthError(AuthErrorCode.InvalidCredentials));
		});

		it('should throw error if site is under admin access only and user is unauthorized', async () => {
			mUserFindFirst.mockResolvedValue(baseUserFixtureA);
			mGetMaintenanceMode.mockReturnValue(MaintenanceMode.ADMIN);

			await expect(
				signInWithEmailAndPassword(mRequestEvent, baseUserFixtureA.email, mPassword)
			).rejects.toThrowError(new AuthError(AuthErrorCode.Unauthorized));
		});

		it('should sign in if site is under admin access only and user is authorized', async () => {
			mUserFindFirst.mockResolvedValue({
				...baseUserFixtureA,
				profile: {
					role: Role.ADMIN
				}
			});
			mGetMaintenanceMode.mockReturnValue(MaintenanceMode.ADMIN);

			await signInWithEmailAndPassword(mRequestEvent, baseUserFixtureA.email, mPassword);
		});

		it('should throw error if maintenance mode is verified and user is not verified', async () => {
			mGetMaintenanceMode.mockReturnValue(MaintenanceMode.VERIFIED);
			mUserFindFirst.mockResolvedValue(baseUserFixtureB);

			await expect(
				signInWithEmailAndPassword(mRequestEvent, baseUserFixtureA.email, mPassword)
			).rejects.toThrowError(new AuthError(AuthErrorCode.Unauthorized));
		});

		it('should sign in if maintenance mode is verified and user is verified', async () => {
			mGetMaintenanceMode.mockReturnValue(MaintenanceMode.VERIFIED);
			mUserFindFirst.mockResolvedValue(baseUserFixtureA);

			await expect(
				signInWithEmailAndPassword(mRequestEvent, baseUserFixtureA.email, mPassword)
			).resolves.not.toThrow();
		});

		it('should throw error if maintenance mode is locked', async () => {
			mGetMaintenanceMode.mockReturnValue(MaintenanceMode.LOCKED);
			mUserFindFirst.mockResolvedValue(baseUserFixtureB);

			await expect(
				signInWithEmailAndPassword(mRequestEvent, baseUserFixtureA.email, mPassword)
			).rejects.toThrowError(new AuthError(AuthErrorCode.Unauthorized));
		});
	});

	describe('refreshSession', () => {
		it('should clear user and session if no session cookie is present', async () => {
			mCookiesGet.mockReturnValue(null);

			await refreshSession(mRequestEvent);

			expect(mRequestEvent.locals.user).toBeNull();
			expect(mRequestEvent.locals.session).toBeNull();
			expect(mCookiesSet).not.toHaveBeenCalled();
		});

		it('should set user and session if session cookie is valid and fresh', async () => {
			const mockSessionId = 'validSessionId';
			const mockUser = { id: 'userId', email: 'test@example.com' };
			const mockSession = { id: mockSessionId, fresh: true };

			mCookiesGet.mockReturnValue(mockSessionId);
			mValidateSession.mockResolvedValue({ session: mockSession, user: mockUser });
			mCreateSessionCookie.mockReturnValue({
				name: mSessionCookieName,
				value: 'newSessionValue',
				attributes: {}
			});

			await refreshSession(mRequestEvent);

			expect(mRequestEvent.locals.user).toEqual(mockUser);
			expect(mRequestEvent.locals.session).toEqual(mockSession);
			expect(mCookiesSet).toHaveBeenCalledWith(mSessionCookieName, 'newSessionValue', {
				path: '.',
				...{}
			});
		});

		it('should set blank session cookie if session is not valid', async () => {
			const mockSessionId = 'invalidSessionId';

			mCookiesGet.mockReturnValue(mockSessionId);
			mValidateSession.mockResolvedValue({ session: null, user: null });
			mCreateBlankSessionCookie.mockReturnValue({
				name: mSessionCookieName,
				value: 'blankSessionValue',
				attributes: {}
			});

			await refreshSession(mRequestEvent);

			expect(mRequestEvent.locals.user).toBeNull();
			expect(mRequestEvent.locals.session).toBeNull();
			expect(mCookiesSet).toHaveBeenCalledWith(mSessionCookieName, 'blankSessionValue', {
				path: '.',
				...{}
			});
		});
	});

	describe('verifyVerificationCode', () => {
		it('should verify verification code', async () => {
			mEmailVerificationCodeFindFirst.mockResolvedValue(relationalEmailVerificationCodeFixtureA);
			vi.setSystemTime(new Date('12-31-2000'));

			const result = await verifyVerificationCode(
				baseUserFixtureA,
				relationalEmailVerificationCodeFixtureA.code
			);

			expect(result).toEqual(true);
			expect(mEmailVerificationCodeFindFirst).toHaveBeenCalledTimes(1);
			expect(mEmailVerificationCodeFindFirst).toHaveBeenCalledWith({
				where: { userId: baseUserFixtureA.id },
				select: { id: true, code: true, email: true, expiresAt: true }
			});
			expect(mEmailVerificationCodeDelete).toHaveBeenCalledTimes(1);
			expect(mEmailVerificationCodeDelete).toHaveBeenCalledWith({
				where: { id: relationalEmailVerificationCodeFixtureA.id }
			});
		});

		it("should return false if provided code and database code aren't the same", async () => {
			mEmailVerificationCodeFindFirst.mockResolvedValue(relationalEmailVerificationCodeFixtureA);
			vi.setSystemTime(new Date('12-31-2000'));

			const result = await verifyVerificationCode(baseUserFixtureA, 'AZE-123');

			expect(result).toEqual(false);
			expect(mEmailVerificationCodeFindFirst).toHaveBeenCalledTimes(1);
			expect(mEmailVerificationCodeFindFirst).toHaveBeenCalledWith({
				where: { userId: baseUserFixtureA.id },
				select: { id: true, code: true, email: true, expiresAt: true }
			});
		});

		it('should return false if provided code is expired', async () => {
			mEmailVerificationCodeFindFirst.mockResolvedValue(relationalEmailVerificationCodeFixtureA);
			vi.setSystemTime(new Date('12-31-3000'));

			const result = await verifyVerificationCode(
				baseUserFixtureA,
				relationalEmailVerificationCodeFixtureA.code
			);

			expect(result).toEqual(false);
			expect(mEmailVerificationCodeFindFirst).toHaveBeenCalledTimes(1);
			expect(mEmailVerificationCodeFindFirst).toHaveBeenCalledWith({
				where: { userId: baseUserFixtureA.id },
				select: { id: true, code: true, email: true, expiresAt: true }
			});
			expect(mEmailVerificationCodeDelete).toHaveBeenCalledTimes(1);
			expect(mEmailVerificationCodeDelete).toHaveBeenCalledWith({
				where: { id: relationalEmailVerificationCodeFixtureA.id }
			});
		});

		it("should return false if provided code's email is not the same as the currnet user's email", async () => {
			mEmailVerificationCodeFindFirst.mockResolvedValue({
				...relationalEmailVerificationCodeFixtureA,
				email: 'different@mail.com'
			});
			vi.setSystemTime(new Date('12-31-2000'));

			const result = await verifyVerificationCode(
				baseUserFixtureA,
				relationalEmailVerificationCodeFixtureA.code
			);

			expect(result).toEqual(false);
			expect(mEmailVerificationCodeFindFirst).toHaveBeenCalledTimes(1);
			expect(mEmailVerificationCodeFindFirst).toHaveBeenCalledWith({
				where: { userId: baseUserFixtureA.id },
				select: { id: true, code: true, email: true, expiresAt: true }
			});
			expect(mEmailVerificationCodeDelete).toHaveBeenCalledTimes(1);
			expect(mEmailVerificationCodeDelete).toHaveBeenCalledWith({
				where: { id: relationalEmailVerificationCodeFixtureA.id }
			});
		});
	});

	describe('checkHandle', () => {
		it('should not return error for valid handle', async () => {
			const mHandle = 'handle';

			const result = await checkHandle(mHandle);

			expect(result).toBeUndefined();
			expect(mProfileFindFirst).toHaveBeenCalledWith({
				where: { handle: mHandle },
				select: { id: true }
			});
			expect(mHandleBlacklistFindFirst).toHaveBeenCalledWith({
				where: { handle: mHandle }
			});
		});

		it('should return invalid handle auth error code for blacklisted handle', async () => {
			const mHandle = 'blacklistedHandle';
			mTransaction.mockResolvedValue([{ handle: mHandle }, null]);

			const result = await checkHandle(mHandle);

			expect(result).toEqual(AuthErrorCode.InvalidHandle);
		});

		it('should return handle already used auth error code for duplicated handle', async () => {
			const mHandle = 'usedHandle';
			mTransaction.mockResolvedValue([null, { id: 'userId' }]);

			const result = await checkHandle(mHandle);

			expect(result).toEqual(AuthErrorCode.HandleAlreadyInUse);
		});
	});

	describe('isAuthenticated', () => {
		it.each([
			{
				locals: {
					session: {}
				},
				expectedReturn: true
			},
			{
				locals: {
					session: null
				},
				expectedReturn: false
			}
		])('should return expected return %o', ({ locals, expectedReturn }) => {
			const result = isAuthenticated({ locals } as unknown as RequestEvent);

			expect(result).toEqual(expectedReturn);
		});
	});

	describe('isVerified', () => {
		it.each([
			{
				locals: {
					user: {
						emailVerified: true
					}
				},
				expectedReturn: true
			},
			{
				locals: {
					user: {
						emailVerified: false
					}
				},
				expectedReturn: false
			},
			{
				locals: {
					user: null
				},
				expectedReturn: false
			}
		])('should return expected return %o', ({ locals, expectedReturn }) => {
			const result = isVerified({ locals } as unknown as RequestEvent);

			expect(result).toEqual(expectedReturn);
		});
	});

	describe('isAdmin', () => {
		it.each([
			{
				locals: {
					profile: {
						role: Role.ADMIN
					}
				},
				expectedReturn: true
			},
			{
				locals: {
					profile: {
						role: Role.USER
					}
				},
				expectedReturn: false
			},
			{
				locals: {
					profile: null
				},
				expectedReturn: false
			}
		])('should return expected return %o', ({ locals, expectedReturn }) => {
			const result = isAdmin({ locals } as unknown as RequestEvent);

			expect(result).toEqual(expectedReturn);
		});
	});

	describe('isRestricted', () => {
		it.each([
			{
				locals: {
					profile: {
						role: Role.RESTRICTED
					}
				},
				expectedReturn: true
			},
			{
				locals: {
					profile: {
						role: Role.USER
					}
				},
				expectedReturn: false
			},
			{
				locals: {
					profile: null
				},
				expectedReturn: false
			}
		])('should return expected return %o', ({ locals, expectedReturn }) => {
			const result = isRestricted({ locals } as unknown as RequestEvent);

			expect(result).toEqual(expectedReturn);
		});
	});
});
