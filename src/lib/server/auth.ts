import { dev } from '$app/environment';
import { handleField } from '$lib/schemas/auth/fields';
import { AuthError, AuthErrorCode } from '$lib/utils/auth-error';
import { hash, verify } from '@node-rs/argon2';
import { MaintenanceMode, Role, type Profile, type User } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';
import { generateIdFromEntropySize, type Session } from 'lucia';
import { TimeSpan, createDate, isWithinExpirationDate } from 'oslo';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { sendOTPVerificationEmail } from './email';
import { lucia } from './lucia';
import { prisma } from './prisma';
import { getMaintenanceMode } from './utils';

export const hashOptions = {
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1
};

export const emailVerificationCodeExpiryMinutes = 15;

export const hashPassword = async (password: string) => hash(password, hashOptions);

export const verifyPassword = async (password: string, hashed: string) =>
	verify(hashed, password, hashOptions);

export const signUpWithEmailAndPassword = async (
	event: RequestEvent,
	email: string,
	password: string,
	meta: Pick<Profile, 'displayName' | 'handle'>
): Promise<User> => {
	switch (getMaintenanceMode(event)) {
		case MaintenanceMode.Verified:
		case MaintenanceMode.AdminOnly:
		case MaintenanceMode.Locked:
			throw new AuthError(AuthErrorCode.Unauthorized);
	}

	if (!handleField.safeParse(meta.handle).success) throw new AuthError(AuthErrorCode.InvalidHandle);

	const handleError = await checkHandle(meta.handle);
	if (handleError) throw new AuthError(handleError);

	const existingUserEmail = await prisma.user.findFirst({
		where: { email }
	});
	if (existingUserEmail) throw new AuthError(AuthErrorCode.EmailAlreadyInUse);

	const hashedPassword = await hashPassword(password);
	const id = generateIdFromEntropySize(10);
	const user = await prisma.user.create({
		data: {
			id,
			email,
			passwordHash: hashedPassword,
			profile: {
				create: {
					...meta,
					interfaceSettings: { create: {} },
					privacySettings: { create: {} }
				}
			}
		}
	});

	await createSession(id, event);

	const verificationCode = await generateEmailVerificationCode(id, email);
	const success = await sendOTPVerificationEmail(verificationCode, {
		email,
		name: meta.displayName
	});

	if (!success) {
		throw new Error('Could not send verification code email');
	} else if (dev) {
		console.log(`Verification code sent for "${email}":`, verificationCode);
	}

	return user;
};

export const signInWithEmailAndPassword = async (
	event: RequestEvent,
	email: string,
	password: string
): Promise<void> => {
	const existingUser = await prisma.user.findFirst({
		where: { email, deletedAt: null },
		select: {
			id: true,
			passwordHash: true,
			emailVerified: true,
			profile: { select: { role: true } }
		}
	});
	if (!existingUser) {
		throw new AuthError(AuthErrorCode.InvalidCredentials);
	}

	switch (getMaintenanceMode(event)) {
		case MaintenanceMode.Verified: {
			if (!existingUser.emailVerified) throw new AuthError(AuthErrorCode.Unauthorized);
			break;
		}
		case MaintenanceMode.AdminOnly: {
			if (existingUser.profile?.role !== Role.ADMIN)
				throw new AuthError(AuthErrorCode.Unauthorized);
			break;
		}
		case MaintenanceMode.Locked: {
			throw new AuthError(AuthErrorCode.Unauthorized);
		}
	}

	if (!dev) {
		const validPassword = await verifyPassword(password, existingUser.passwordHash);
		if (!validPassword) {
			throw new AuthError(AuthErrorCode.InvalidCredentials);
		}
	}

	await createSession(existingUser.id, event);
};

export const refreshSession = async (event: RequestEvent) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return;
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}

	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}

	event.locals.user = user;
	event.locals.session = session;
};

export const createSession = async (userId: string, event: RequestEvent) => {
	const session = await lucia.createSession(userId, {});
	const sessionCookie = lucia.createSessionCookie(session.id);

	event.cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});
};

export const generateEmailVerificationCode = async (
	userId: string,
	email: string
): Promise<string> => {
	await prisma.emailVerificationCode.deleteMany({ where: { userId } });

	const code = generateRandomString(6, alphabet('0-9', 'A-Z'));
	await prisma.emailVerificationCode.create({
		data: {
			userId,
			email,
			code,
			expiresAt: createDate(new TimeSpan(emailVerificationCodeExpiryMinutes, 'm'))
		}
	});

	return code;
};

export const verifyVerificationCode = async (
	user: Pick<User, 'id' | 'email'>,
	code: string
): Promise<boolean> => {
	const databaseCode = await prisma.emailVerificationCode.findFirst({
		where: { userId: user.id },
		select: { id: true, code: true, email: true, expiresAt: true }
	});
	if (!databaseCode || databaseCode.code !== code) return false;

	await prisma.emailVerificationCode.delete({ where: { id: databaseCode.id } });

	if (!isWithinExpirationDate(databaseCode.expiresAt)) return false;
	if (databaseCode.email !== user.email) return false;

	return true;
};

export const checkHandle = async (handle: string): Promise<AuthErrorCode | undefined> => {
	const result = await prisma.$transaction([
		prisma.handleBlacklist.findFirst({ where: { handle } }),
		prisma.profile.findFirst({
			where: { handle },
			select: {
				id: true // EMPTY SELECT
			}
		})
	]);

	if (result[0]) {
		return AuthErrorCode.InvalidHandle;
	}

	if (result[1]) {
		return AuthErrorCode.HandleAlreadyInUse;
	}
};

export const isAuthenticated = (
	event: RequestEvent
): event is RequestEvent & { locals: { user: User; session: Session; profile: Profile } } =>
	!!event.locals.session;

export const isVerified = (
	event: RequestEvent
): event is RequestEvent & { locals: { user: User; session: Session; profile: Profile } } =>
	!!event.locals.user?.emailVerified;
