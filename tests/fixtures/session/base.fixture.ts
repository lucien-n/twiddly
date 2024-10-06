import type { Session } from '@prisma/client';

export type BaseSession = Omit<Session, 'userId'>;

export const baseSessionFixtureA: BaseSession = {
	id: 'b669d4c5-dc67-49ac-bf49-6ebb4cbd3aab',
	expiresAt: new Date('2024-10-04T00:00:00Z')
};
