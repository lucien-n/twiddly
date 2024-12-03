import { FollowStatus } from '@prisma/client';
import { baseUserFixtureA, baseUserFixtureB } from '../user';

export const relationalFollowFixtureA = {
	followerId: baseUserFixtureA.id,
	followingId: baseUserFixtureB.id,
	status: FollowStatus.APPROVED
};
