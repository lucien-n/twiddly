import type { Profile } from '@prisma/client';
import { baseUserFixtureA, baseUserFixtureB } from '../user/base.fixture';
import { baseProfileFixtureA, baseProfileFixtureB } from './base.fixture';

export const relationalProfileFixtureA: Profile = {
	...baseProfileFixtureA,
	id: baseUserFixtureA.id
};

export const relationalProfileFixtureB: Profile = {
	...baseProfileFixtureB,
	id: baseUserFixtureB.id
};
