import type { FollowAction } from '$lib/schemas/follow/update-request';
import { AuthCode } from '$lib/utils/auth-code';
import { relationalFollowFixtureA } from '$tests/fixtures/follow';
import { relationalProfileFixtureA, relationalProfileFixtureB } from '$tests/fixtures/profile';
import {
	mFollowCreate,
	mFollowDelete,
	mFollowFindUnique,
	mFollowUpdate,
	mProfileFindFirst,
	mProfileFindUnique,
	mProfileUpdate,
	mTransaction
} from '$tests/mocks/prisma';
import { FollowStatus } from '@prisma/client';
import { json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { DELETE, POST, PUT } from './+server';

const mUserA = relationalProfileFixtureA;
const mUserB = relationalProfileFixtureB;

const mBaseLocals = {
	session: { userId: mUserA.id },
	user: { emailVerified: true }
} as RequestEvent['locals'];
const mBaseParams = { handle: mUserB.handle } as RequestEvent['params'];
const mBaseEvent = {
	locals: mBaseLocals,
	params: mBaseParams
} as RequestEvent;

describe('POST', () => {
	beforeEach(async () => {
		vi.resetAllMocks();
	});

	it('should follow', async () => {
		mProfileFindFirst.mockResolvedValue(mUserB);

		const result = await POST(mBaseEvent);

		expect(result).toMatchObject(json({ data: FollowStatus.APPROVED }));
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
				handle: mUserB.handle,
				user: {
					deletedAt: null
				}
			}
		});
		expect(mFollowCreate).toHaveBeenCalledTimes(1);
		expect(mFollowCreate).toHaveBeenCalledWith({
			data: {
				followerId: mUserA.id,
				followingId: mUserB.id,
				status: FollowStatus.APPROVED
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
				id: mUserA.id
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
				id: mUserB.id
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
				message: `Profile @${mUserB.handle} not found`
			}
		});
	});

	it('should create a follow with a status of pending if profile is private', async () => {
		mProfileFindFirst.mockResolvedValue({ ...mUserB, privacySettings: { private: true } });

		const result = await POST(mBaseEvent);

		expect(result).toMatchObject(json({ data: FollowStatus.PENDING }));
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
				handle: mUserB.handle,
				user: {
					deletedAt: null
				}
			}
		});
		expect(mFollowCreate).toHaveBeenCalledTimes(1);
		expect(mFollowCreate).toHaveBeenCalledWith({
			data: {
				followerId: mUserA.id,
				followingId: mUserB.id,
				status: FollowStatus.PENDING
			}
		});
		expect(mProfileUpdate).toHaveBeenCalledTimes(0);
	});

	it('should throw a generic 500 error if an unknown error occurs', async () => {
		mProfileFindFirst.mockRejectedValue({});

		await expect(POST(mBaseEvent)).rejects.toEqual({
			status: 500,
			body: {
				message: `Could not follow profile @${mUserB.handle}`
			}
		});
	});
});

describe('DELETE', () => {
	beforeEach(async () => {
		vi.resetAllMocks();
	});

	it('should unfollow', async () => {
		mProfileFindFirst.mockResolvedValue(mUserB);

		const result = await DELETE(mBaseEvent);

		expect(result).toMatchObject(json({ data: undefined }));
		expect(mProfileFindFirst).toHaveBeenCalledWith({
			select: {
				id: true
			},
			where: {
				handle: mUserB.handle,
				user: { deletedAt: null },
				followers: {
					some: {
						followerId: mUserA.id
					}
				}
			}
		});
		expect(mFollowDelete).toHaveBeenCalledTimes(1);
		expect(mFollowDelete).toHaveBeenCalledWith({
			where: {
				followerId_followingId: { followerId: mUserA.id, followingId: mUserB.id }
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
				id: mUserA.id
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
				id: mUserB.id
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
				message: `Profile @${mUserB.handle} neither found or followed`
			}
		});
	});

	it('should throw a generic 500 error if an unknown error occurs', async () => {
		mProfileFindFirst.mockRejectedValue({});

		await expect(DELETE(mBaseEvent)).rejects.toEqual({
			status: 500,
			body: {
				message: `Could not unfollow profile @${mUserB.handle}`
			}
		});
	});
});

describe('PUT', () => {
	const getEvent = (action: FollowAction = 'APPROVE'): RequestEvent =>
		({
			...mBaseEvent,
			params: {
				handle: mUserB.handle
			},
			request: {
				json: () => ({ action })
			}
		}) as unknown as RequestEvent;

	beforeEach(async () => {
		vi.resetAllMocks();

		mProfileFindUnique.mockResolvedValue(mUserB);
		mFollowFindUnique.mockResolvedValue(relationalFollowFixtureA);
	});

	it('should accept pending follow request', async () => {
		const mEvent = getEvent('APPROVE');

		const result = await PUT(mEvent);

		expect(result).toMatchObject(json({ data: FollowStatus.APPROVED }));
		expect(mProfileFindUnique).toHaveBeenCalledWith({
			select: {
				id: true
			},
			where: {
				handle: mUserB.handle,
				user: {
					deletedAt: null
				}
			}
		});
		expect(mFollowUpdate).toHaveBeenCalledTimes(1);
		expect(mFollowUpdate).toHaveBeenCalledWith({
			data: {
				status: FollowStatus.APPROVED
			},
			where: {
				followerId_followingId: {
					followerId: mUserB.id,
					followingId: mUserA.id
				},
				status: FollowStatus.PENDING
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
				id: mUserB.id
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
				id: mUserA.id
			}
		});
	});

	it('should reject pending follow request', async () => {
		const mEvent = getEvent('REJECT');

		const result = await PUT(mEvent);

		expect(result).toMatchObject(json({ data: undefined }));
		expect(mProfileFindUnique).toHaveBeenCalledWith({
			select: {
				id: true
			},
			where: {
				handle: mUserB.handle,
				user: {
					deletedAt: null
				}
			}
		});
		expect(mFollowDelete).toHaveBeenCalledTimes(1);
		expect(mFollowDelete).toHaveBeenCalledWith({
			where: {
				followerId_followingId: {
					followerId: mUserB.id,
					followingId: mUserA.id
				},
				status: FollowStatus.PENDING
			}
		});
	});

	it('should camcel pending follow request', async () => {
		const mEvent = getEvent('CANCEL');

		const result = await PUT(mEvent);

		expect(result).toMatchObject(json({ data: undefined }));
		expect(mProfileFindUnique).toHaveBeenCalledWith({
			select: {
				id: true
			},
			where: {
				handle: mUserB.handle,
				user: {
					deletedAt: null
				}
			}
		});
		expect(mFollowDelete).toHaveBeenCalledTimes(1);
		expect(mFollowDelete).toHaveBeenCalledWith({
			where: {
				followerId_followingId: {
					followerId: mUserA.id,
					followingId: mUserB.id
				},
				status: FollowStatus.PENDING
			}
		});
	});

	it('should throw a 401 auth required error if user is not verified', async () => {
		await expect(
			PUT({
				...getEvent(),
				locals: { user: { emailVerified: false } }
			} as RequestEvent)
		).rejects.toEqual({
			status: 401,
			body: {
				message: AuthCode.AuthRequired
			}
		});
	});

	it('should throw a 404 profile not found error if profile is not found', async () => {
		mProfileFindUnique.mockResolvedValue(null);

		await expect(PUT(getEvent())).rejects.toEqual({
			status: 404,
			body: {
				message: `Profile @${mUserB.handle} not found`
			}
		});
	});

	it('should throw a 422 error if the body is invalid', async () => {
		await expect(
			PUT({ ...mBaseEvent, request: { json: async () => ({ action: 'INVALID' }) } } as RequestEvent)
		).rejects.toEqual({
			status: 422,
			body: {
				message: 'Invalid body'
			}
		});
	});

	it('should throw a generic 500 error if an unknown error occurs', async () => {
		mTransaction.mockRejectedValue(new Error('some error'));

		await expect(PUT(getEvent('APPROVE'))).rejects.toEqual({
			status: 500,
			body: {
				message: 'An error occured'
			}
		});
	});
});
