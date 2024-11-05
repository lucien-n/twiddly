import type { User, Profile } from '@prisma/client';

export type DataUser = Pick<
	User,
	'id' | 'createdAt' | 'deletedAt' | 'updatedAt' | 'email' | 'emailVerified'
> &
	Pick<Profile, 'handle' | 'displayName' | 'role'>;
