import type { Profile } from '@prisma/client';
import { baseUserFixtureA } from '../user/base.fixture';
import { baseProfileFixtureA } from './base.fixture';

export const relationalProfileFixtureA: Profile = {
	...baseProfileFixtureA,
	id: baseUserFixtureA.id
};
