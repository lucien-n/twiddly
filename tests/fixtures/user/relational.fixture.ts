import { baseProfileFixtureA } from '../profile/base.fixture';
import { baseUserFixtureA } from './base.fixture';

export const relationalUserFixtureA = {
	...baseUserFixtureA,
	profile: baseProfileFixtureA
};
