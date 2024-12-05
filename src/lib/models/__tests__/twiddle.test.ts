import { describe, it, expect, vi } from 'vitest';
import { Role } from '@prisma/client';
import { superValidate } from 'sveltekit-superforms';
import {
	formatTwiddle,
	formatTwiddles,
	isLiked,
	getTwiddleSelect,
	getTwiddleOrderBy,
	getTwiddleWhere
} from '../twiddle';
import { getProfileSelect } from '../profile';

vi.mock('sveltekit-superforms', () => ({
	superValidate: vi.fn().mockResolvedValue({ valid: true })
}));

vi.mock('../profile', async (importOriginal) => {
	const original = await importOriginal();

	return {
		...(original as object),
		formatProfile: vi.fn((profile) => profile)
	};
});

const mCurrentUserId = 'currentUserId';
const mBaseTwiddleData = {
	id: 'twiddleId',
	content: 'Hello world',
	createdAt: new Date('2024-08-12 1:00PM'),
	editedAt: null,
	likeCount: 10,
	commentCount: 2,
	author: { id: 'authorId', handle: 'authorHandle' },
	likes: [{ profileId: mCurrentUserId }],
	children: [],
	deleted: false,
	parent: null
};

describe('formatTwiddle', () => {
	it('should correctly format a twiddle', async () => {
		const result = await formatTwiddle(mBaseTwiddleData, mCurrentUserId);

		expect(result).toStrictEqual({
			data: {
				id: 'twiddleId',
				content: 'Hello world',
				isLiked: true,
				likeCount: 10,
				commentCount: 2,
				author: mBaseTwiddleData.author,
				isEdited: false,
				parent: undefined,
				comments: [],
				createdAt: new Date('2024-08-12 1:00PM')
			},
			setCommentForm: {
				valid: true
			},
			setTwiddleForm: {
				valid: true
			}
		});
		expect(superValidate).toHaveBeenCalledTimes(2);
	});

	it('should handle deleted twiddles', async () => {
		const result = await formatTwiddle({ ...mBaseTwiddleData, deleted: true }, mCurrentUserId);

		expect(result.data).toMatchObject({
			content: 'This post has been deleted',
			likeCount: 0,
			isLiked: false
		});
	});
});

describe('formatTwiddles', () => {
	it('should format an array of twiddles', async () => {
		const mTwiddleArray = [
			{ ...mBaseTwiddleData, id: 'twiddleId1' },
			{ ...mBaseTwiddleData, id: 'twiddleId2' }
		];

		const result = await formatTwiddles(mTwiddleArray, mCurrentUserId);

		expect(result).toMatchObject([{ data: { id: 'twiddleId1' } }, { data: { id: 'twiddleId2' } }]);
	});
});

describe('isLiked', () => {
	it.each([
		{
			currentUserId: 'currentUserId',
			likes: [{ profileId: 'userId1' }, { profileId: 'currentUserId' }],
			expectedReturn: true
		},
		{
			currentUserId: 'currentUserId',
			likes: [{ profileId: 'userId1' }, { profileId: 'userId2' }],
			expectedReturn: false
		},
		{
			currentUserId: undefined,
			likes: [{ profileId: 'userId1' }, { profileId: 'userId2' }],
			expectedReturn: false
		},
		{
			currentUserId: 'currentUserId',
			likes: [],
			expectedReturn: false
		}
	])('should return the expected result for %o', ({ currentUserId, likes, expectedReturn }) => {
		expect(isLiked(currentUserId, likes)).toBe(expectedReturn);
	});
});

describe('getTwiddleSelect', () => {
	it.each([
		{
			currentUserId: 'currentUserId',
			likesWhere: { profileId: 'currentUserId' }
		},
		{
			currentUserId: undefined,
			likesWhere: { profileId: undefined }
		}
	])('should return the expected result for %o', ({ currentUserId, likesWhere }) => {
		const baseReturn = {
			id: true,
			editedAt: true,
			content: true,
			createdAt: true,
			likeCount: true,
			commentCount: true,
			author: { select: getProfileSelect() }
		};
		const expectedReturn = { ...baseReturn, likes: { where: likesWhere } };

		expect(getTwiddleSelect(currentUserId)).toMatchObject(expectedReturn);
	});
});

describe('getTwiddleOrderBy', () => {
	it.each([
		{
			orderBy: undefined,
			expectedReturn: { createdAt: 'desc' }
		},
		{
			orderBy: { likeCount: 'asc' } as const,
			expectedReturn: { createdAt: 'desc', likeCount: 'asc' }
		}
	])('should return the expected result for %o', ({ orderBy, expectedReturn }) => {
		expect(getTwiddleOrderBy(orderBy)).toEqual(expectedReturn);
	});
});

describe('getTwiddleWhere', () => {
	it.each([
		{
			where: undefined,
			expectedReturn: {
				deletedAt: null,
				author: {
					user: { deletedAt: null },
					role: { not: Role.RESTRICTED }
				}
			}
		},
		{
			where: { likeCount: { gt: 10 } },
			expectedReturn: {
				deletedAt: null,
				author: {
					user: { deletedAt: null },
					role: { not: Role.RESTRICTED }
				},
				likeCount: { gt: 10 }
			}
		}
	])('should return the expected result for %o', ({ where, expectedReturn }) => {
		expect(getTwiddleWhere(where)).toEqual(expectedReturn);
	});
});
