import {
	mFollowCreate,
	mFollowDelete,
	mProfileFindFirst,
	mProfileUpdate
} from '$tests/mocks/prisma';
import { relationalProfileFixtureA, relationalProfileFixtureB } from '$tests/fixtures/profile';
import type { RequestEvent } from './$types';
import { DELETE, POST } from './+server';
import { AuthCode } from '@/lib/utils/auth-code';

describe('POST', () => {
	const mFollower = relationalProfileFixtureA;
	const mFollowing = relationalProfileFixtureB;

	const mBaseLocals = {
		session: { userId: mFollower.id },
		user: { emailVerified: true }
	} as RequestEvent['locals'];
	const mBaseParams = { handle: mFollowing.handle } as RequestEvent['params'];
	const mBaseEvent = {
		locals: mBaseLocals,
		params: mBaseParams
	} as RequestEvent;

	beforeEach(async () => {
		vi.resetAllMocks();
	});

	it('should follow', async () => {
		mProfileFindFirst.mockResolvedValue(mFollowing);

		const result = await POST(mBaseEvent);

		expect(result).toEqual(new Response());
		expect(mProfileFindFirst).toHaveBeenCalledWith({
			select: {
				id: true,
				privacySettings: {
					select: {
						private: true
					}
				}
			},
			where: {
				handle: mFollowing.handle,
				user: {
					deletedAt: null
				}
			}
		});
		expect(mFollowCreate).toHaveBeenCalledTimes(1);
		expect(mFollowCreate).toHaveBeenCalledWith({
			data: {
				followerId: mFollower.id,
				followingId: mFollowing.id
			}
		});
		expect(mProfileUpdate).toHaveBeenCalledTimes(2);
		expect(mProfileUpdate).toHaveBeenNthCalledWith(1, {
			data: {
				followingCount: {
					increment: 1
				}
			},
			select: {
				id: true
			},
			where: {
				id: mFollower.id
			}
		});
		expect(mProfileUpdate).toHaveBeenNthCalledWith(2, {
			data: {
				followersCount: {
					increment: 1
				}
			},
			select: {
				id: true
			},
			where: {
				id: mFollowing.id
			}
		});
	});

	it('should throw a 401 auth required error if user is not verified', async () => {
		await expect(
			POST({ locals: { user: { emailVerified: false } } } as RequestEvent)
		).rejects.toEqual({
			status: 401,
			body: {
				message: AuthCode.AuthRequired
			}
		});
	});

	it('should throw a 401 auth required error if user is not verified', async () => {
		await expect(
			POST({ locals: { user: { emailVerified: false } } } as RequestEvent)
		).rejects.toEqual({
			status: 401,
			body: {
				message: AuthCode.AuthRequired
			}
		});
	});

	it('should throw a 404 profile not found error if profile is not found', async () => {
		mProfileFindFirst.mockResolvedValue(null);

		await expect(POST(mBaseEvent)).rejects.toEqual({
			status: 404,
			body: {
				message: `Profile @${mFollowing.handle} not found`
			}
		});
	});

	it('should throw a 401 profile is private error if profile is private', async () => {
		mProfileFindFirst.mockResolvedValue({ ...mFollowing, privacySettings: { private: true } });

		await expect(POST(mBaseEvent)).rejects.toEqual({
			status: 401,
			body: {
				message: `Profile @${mFollowing.handle} is private`
			}
		});
	});

	it('should throw a generic 500 error if an unknown error occurs', async () => {
		mProfileFindFirst.mockRejectedValue({});

		await expect(POST(mBaseEvent)).rejects.toEqual({
			status: 500,
			body: {
				message: `Could not follow profile @${mFollowing.handle}`
			}
		});
	});
});

describe('DELETE', () => {
	const mFollower = relationalProfileFixtureA;
	const mFollowing = relationalProfileFixtureB;

	const mBaseLocals = {
		session: { userId: mFollower.id },
		user: { emailVerified: true }
	} as RequestEvent['locals'];
	const mBaseParams = { handle: mFollowing.handle } as RequestEvent['params'];
	const mBaseEvent = {
		locals: mBaseLocals,
		params: mBaseParams
	} as RequestEvent;

	beforeEach(async () => {
		vi.resetAllMocks();
	});

	it('should unfollow', async () => {
		mProfileFindFirst.mockResolvedValue(mFollowing);

		const result = await DELETE(mBaseEvent);

		expect(result).toEqual(new Response());
		expect(mProfileFindFirst).toHaveBeenCalledWith({
			select: {
				id: true
			},
			where: {
				handle: mFollowing.handle,
				user: { deletedAt: null },
				followers: {
					some: {
						followerId: mFollower.id
					}
				}
			}
		});
		expect(mFollowDelete).toHaveBeenCalledTimes(1);
		expect(mFollowDelete).toHaveBeenCalledWith({
			where: {
				followerId_followingId: { followerId: mFollower.id, followingId: mFollowing.id }
			}
		});
		expect(mProfileUpdate).toHaveBeenCalledTimes(2);
		expect(mProfileUpdate).toHaveBeenNthCalledWith(1, {
			data: {
				followingCount: {
					decrement: 1
				}
			},
			select: {
				id: true
			},
			where: {
				id: mFollower.id
			}
		});
		expect(mProfileUpdate).toHaveBeenNthCalledWith(2, {
			data: {
				followersCount: {
					decrement: 1
				}
			},
			select: {
				id: true
			},
			where: {
				id: mFollowing.id
			}
		});
	});

	it('should throw a 401 auth required error if user is not verified', async () => {
		await expect(
			DELETE({ locals: { user: { emailVerified: false } } } as RequestEvent)
		).rejects.toEqual({
			status: 401,
			body: {
				message: AuthCode.AuthRequired
			}
		});
	});

	it('should throw a 401 auth required error if user is not verified', async () => {
		await expect(
			DELETE({ locals: { user: { emailVerified: false } } } as RequestEvent)
		).rejects.toEqual({
			status: 401,
			body: {
				message: AuthCode.AuthRequired
			}
		});
	});

	it('should throw a 404 profile not found error if profile is not found or not followed', async () => {
		mProfileFindFirst.mockResolvedValue(null);

		await expect(DELETE(mBaseEvent)).rejects.toEqual({
			status: 404,
			body: {
				message: `Profile @${mFollowing.handle} neither found or followed`
			}
		});
	});

	it('should throw a generic 500 error if an unknown error occurs', async () => {
		mProfileFindFirst.mockRejectedValue({});

		await expect(DELETE(mBaseEvent)).rejects.toEqual({
			status: 500,
			body: {
				message: `Could not unfollow profile @${mFollowing.handle}`
			}
		});
	});
});
