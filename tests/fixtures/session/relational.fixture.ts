import type { Session } from '@prisma/client';
import { baseSessionFixtureA } from './base.fixture';
import { baseUserFixtureA } from '../user/base.fixture';

export const relationalSessionFixtureA: Session = {
	...baseSessionFixtureA,
	userId: baseUserFixtureA.id
};
