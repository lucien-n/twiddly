import type { User } from '@prisma/client';

export type BaseUser = User;

export const baseUserFixtureA: BaseUser = {
	id: '237c2589-87d5-4c47-b160-a21b69e4920f',
	email: 'test@example.com',
	passwordHash:
		'$argon2id$v=19$m=19456,t=2,p=1$NpDqOwIw8x/YWcct0OuomA$LqJv3svMkTHLmp1P6zsP24uyHK1tce7Ri6pr5YPwYuc',
	createdAt: new Date('2024-10-04T00:00:00Z'),
	updatedAt: new Date('2024-10-04T00:00:00Z')
};
