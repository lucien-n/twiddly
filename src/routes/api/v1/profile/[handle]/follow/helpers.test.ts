import { getDecrementFollowCountsActions, getIncrementFollowCountsActions } from './helpers';

describe('getIncrementFollowCountsActions', () => {
	it('should return increment actions', () => {
		const mFollowerId = 'followerId';
		const mFollowingId = 'followingId';

		const result = getIncrementFollowCountsActions(mFollowerId, mFollowingId);

		expect(result).toEqual([expect.any(Object), expect.any(Object)]);
	});
});

describe('getDecrementFollowCountsActions', () => {
	it('should return decrement actions', () => {
		const mFollowerId = 'followerId';
		const mFollowingId = 'followingId';

		const result = getDecrementFollowCountsActions(mFollowerId, mFollowingId);

		expect(result).toEqual([expect.any(Object), expect.any(Object)]);
	});
});
