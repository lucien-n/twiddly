import { dev } from '$app/environment';
import { AuthCode, AuthError } from '$lib/utils/auth-code';
import { hash, verify } from '@node-rs/argon2';
import { MaintenanceMode, Role, type Profile, type User } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import { TimeSpan, createDate, isWithinExpirationDate } from 'oslo';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { sendOTPVerificationEmail } from './email';
import { prisma } from './prisma';
import { getMaintenanceMode } from './utils';

interface LuciaUser {}
interface Session {}

export const hashOptions = {
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1
};

export const emailVerificationCodeExpiryMinutes = 15;

export const hashPassword = async (password: string) => hash(password);

export const verifyPassword = async (password: string, hashed: string) =>
	verify(hashed, password, hashOptions);

export const signUpWithEmailAndPassword = async (
	event: RequestEvent,
	email: string,
	password: string,
	meta: Pick<Profile, 'displayName' | 'handle'>
): Promise<User> => {
	if (getMaintenanceMode(event) !== MaintenanceMode.OPEN)
		throw new AuthError(AuthCode.Unauthorized);

	const handleError = await checkHandle(meta.handle);
	if (handleError) throw new AuthError(handleError);

	const existingUserEmail = await prisma.user.findFirst({
		where: { email }
	});
	if (existingUserEmail) throw new AuthError(AuthCode.EmailAlreadyInUse);

	const hashedPassword = await hashPassword(password);
	// const id = generateIdFromEntropySize(10);
	const id = nanoid();
	const user = await prisma.user.create({
		data: {
			id,
			email,
			passwordHash: hashedPassword,
			profile: {
				create: {
					...meta,
					bio: "Hi, I'm using Twiddly",
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

	if (!success) throw new Error('Could not send verification code email');

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
		await hash(password);
		throw new AuthError(AuthCode.InvalidCredentials);
	}

	switch (getMaintenanceMode(event)) {
		case MaintenanceMode.VERIFIED: {
			if (!existingUser.emailVerified) throw new AuthError(AuthCode.Unauthorized);
			break;
		}
		case MaintenanceMode.ADMIN: {
			if (existingUser.profile?.role !== Role.ADMIN) throw new AuthError(AuthCode.Unauthorized);
			break;
		}
		case MaintenanceMode.LOCKED: {
			throw new AuthError(AuthCode.Unauthorized);
		}
	}

	if (!dev) {
		const validPassword = await verifyPassword(password, existingUser.passwordHash);
		if (!validPassword) {
			throw new AuthError(AuthCode.InvalidCredentials);
		}
	}

	await createSession(existingUser.id, event);
};

export const refreshSession = async (
	event: RequestEvent
): Promise<{ user: LuciaUser | null; session: Session | null }> => {
	return { user: null, session: null };
};

export const createSession = async (userId: string, event: RequestEvent) => {
	return;
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

export const checkHandle = async (handle: string): Promise<AuthCode | undefined> => {
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
		return AuthCode.InvalidHandle;
	}

	if (result[1]) {
		return AuthCode.HandleAlreadyInUse;
	}
};

export const isRestricted = (
	event: RequestEvent
): event is RequestEvent & {
	locals: {
		user: User;
		session: Session;
		profile: Profile;
	};
} => event.locals.profile?.role === Role.RESTRICTED;

export const isAuthenticated = (
	event: RequestEvent
): event is RequestEvent & { locals: { user: User; session: Session; profile: Profile } } =>
	!isRestricted(event) && !!event.locals.session;

export const isVerified = (
	event: RequestEvent
): event is RequestEvent & { locals: { user: User; session: Session; profile: Profile } } =>
	!isRestricted(event) && !!event.locals.user?.emailVerified;

export const isAdmin = (
	event: RequestEvent
): event is RequestEvent & {
	locals: { user: User; session: Session; profile: Profile & { role: typeof Role.ADMIN } };
} => event.locals.profile?.role === Role.ADMIN;
