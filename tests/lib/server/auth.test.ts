import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RequestEvent } from '@sveltejs/kit';
import { baseProfileFixtureA } from '$tests/fixtures/profile';
import { baseUserFixtureA } from '$tests/fixtures/user';
import {
	mCreateBlankSessionCookie,
	mCreateSession,
	mCreateSessionCookie,
	mSessionCookieName,
	mValidateSession
} from '$tests/mocks/lucia';
import { mProfileFindFirst, mUserCreate, mUserFindFirst } from '$tests/mocks/prisma';
import {
	hashPassword,
	refreshSession,
	signInWithEmailAndPassword,
	signUpWithEmailAndPassword,
	verifyPassword
} from '$lib/server/auth';
import { AuthError, AuthErrorCode } from '$lib/utils/auth-error';
import { baseSessionFixtureA } from '$tests/fixtures/session';

const mPassword = 'password';
const mHashedPassword =
	'$argon2id$v=19$m=19456,t=2,p=1$NpDqOwIw8x/YWcct0OuomA$LqJv3svMkTHLmp1P6zsP24uyHK1tce7Ri6pr5YPwYuc';

const mCookiesSet = vi.fn();
const mCookiesGet = vi.fn();
const mRequestEvent = {
	cookies: { set: mCookiesSet, get: mCookiesGet },
	locals: {}
} as unknown as RequestEvent;

describe('auth module', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('hashPassword', () => {
		it('should hash a password correctly', async () => {
			const hashedPassword = await hashPassword(mPassword);
			expect(hashedPassword).toBeDefined();
			expect(typeof hashedPassword).toBe('string');
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
			mCreateSession.mockResolvedValue(baseSessionFixtureA);
			mCreateSessionCookie.mockResolvedValue({
				cookieName: mSessionCookieName
			});

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
				where: { handle: baseProfileFixtureA.handle }
			});
			expect(mUserFindFirst).toHaveBeenCalledTimes(1);
			expect(mUserFindFirst).toHaveBeenCalledWith({ where: { email: baseUserFixtureA.email } });
			expect(mUserCreate).toHaveBeenCalledTimes(1);
			expect(mCreateSession).toHaveBeenCalledTimes(1);
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
			mProfileFindFirst.mockResolvedValue(baseProfileFixtureA);

			await expect(
				signUpWithEmailAndPassword(mRequestEvent, 'different@mail.com', mPassword, {
					displayName: baseProfileFixtureA.displayName,
					handle: baseProfileFixtureA.handle
				})
			).rejects.toThrowError(new AuthError(AuthErrorCode.HandleAlreadyInUse));
		});

		it('should throw error if handle is invalid', async () => {
			await expect(
				signUpWithEmailAndPassword(mRequestEvent, 'different@mail.com', mPassword, {
					displayName: baseProfileFixtureA.displayName,
					handle: 'handle with spaces'
				})
			).rejects.toThrowError(new AuthError(AuthErrorCode.InvalidHandle));
		});
	});

	describe('signInWithEmailAndPassword', () => {
		it('should sign in an existing user with valid credentials', async () => {
			mUserFindFirst.mockResolvedValue(baseUserFixtureA);
			mCreateSession.mockResolvedValue(baseSessionFixtureA);
			mCreateSessionCookie.mockResolvedValue({
				cookieName: mSessionCookieName
			});

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
});
