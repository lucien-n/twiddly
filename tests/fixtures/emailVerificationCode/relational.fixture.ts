import type { EmailVerificationCode } from '@prisma/client';
import { baseUserFixtureA } from '../user/base.fixture';
import { baseEmailVerificationCodeFixtureA } from './base.fixture';

export const relationalEmailVerificationCodeFixtureA: EmailVerificationCode = {
	...baseEmailVerificationCodeFixtureA,
	email: baseUserFixtureA.email,
	userId: baseUserFixtureA.id
};
