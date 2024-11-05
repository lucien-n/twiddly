import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	signIn,
	signUp,
	signOut,
	otpVerification,
	sendOtpEmail,
	deleteAccount
} from '$lib/actions/auth';
import { route } from '$lib/ROUTES';
import { redirect, type RequestEvent } from '@sveltejs/kit';
import { baseSessionFixtureA } from '$tests/fixtures/session';

// Mock external dependencies
vi.mock('$lib/server/lucia');
vi.mock('$lib/server/prisma');
vi.mock('$lib/server/auth');
vi.mock('$lib/server/email');

describe('Auth Actions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('signIn', () => {
		it('should redirect if already authenticated', async () => {
			const mEvent = { locals: { session: baseSessionFixtureA } } as RequestEvent;

			const result = await signIn(mEvent);
			expect(result).toEqual(redirect(302, route('/')));
		});
		// Add more signIn tests
	});

	describe('signUp', () => {
		it('should redirect if already authenticated', async () => {
			const mEvent = { locals: { session: baseSessionFixtureA } } as RequestEvent;

			const result = await signUp(mEvent);
			expect(result).toEqual(redirect(302, route('/')));
		});
		// Add more signUp tests
	});

	describe('signOut', () => {
		it('should redirect if not authenticated', async () => {
			const mEvent = { locals: { session: baseSessionFixtureA } } as RequestEvent;

			const result = await signOut(mEvent);
			expect(result).toEqual(redirect(302, route('/')));
		});
		// Add more signOut tests
	});

	describe('otpVerification', () => {
		it('should redirect if already verified', async () => {
			const mEvent = {
				locals: { user: { emailVerified: true }, session: baseSessionFixtureA }
			} as RequestEvent;

			const result = await otpVerification(mEvent);
			expect(result).toEqual(redirect(302, route('/')));
		});

		it('should redirect if not authenticated', async () => {
			const mEvent = {
				locals: { user: { emailVerified: true } }
			} as RequestEvent;

			const result = await otpVerification(mEvent);
			expect(result).toEqual(redirect(302, route('/')));
		});
		// Add more otpVerification tests
	});

	describe('sendOtpEmail', () => {
		it('should redirect if already verified', async () => {
			const mEvent = {
				locals: { user: { emailVerified: true } }
			} as RequestEvent;

			const result = await sendOtpEmail(mEvent);
			expect(result).toEqual(redirect(302, route('/')));
		});
		// Add more sendOtpEmail tests
	});

	describe('deleteAccount', () => {
		it('should redirect if not authenticated', async () => {
			const mEvent = {
				locals: {}
			} as RequestEvent;

			const result = await deleteAccount(mEvent);
			expect(result).toEqual(redirect(302, route('/')));
		});
		// Add more deleteAccount tests
	});
});
