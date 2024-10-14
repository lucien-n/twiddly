import type { EmailVerificationCode } from '@prisma/client';

type BaseEmailVerificationCode = Omit<EmailVerificationCode, 'userId' | 'email'>;
export const baseEmailVerificationCodeFixtureA: BaseEmailVerificationCode = {
	id: '80ccf72a-2f74-44b4-9a72-0a9d815784d2',
	code: 'WQE-123',
	expiresAt: new Date('12-31-2099')
};
