import { baseUserFixtureB } from '$tests/fixtures/user';
import { AvatarBackgroundColor, FollowStatus, Role, ThemeColor, ThemeMode } from '@prisma/client';
import { getAvatarBgColor, getProfileAvatar } from '../utils/avatar';
import { formatProfile, getProfileSelect } from './profile';

describe('formatProfile', () => {
	const mCurrentUserId = baseUserFixtureB.id;
	const mBaseProfileData = {
		id: 'profileId',
		bio: "Hi, I'm using Twiddly !",
		role: Role.ADMIN,
		handle: 'john',
		avatarBackgroundColor: AvatarBackgroundColor.LAVENDER,
		createdAt: new Date('2024-21-12 14:41AM'),
		updatedAt: new Date('2025-12-01 15:11AM'),
		displayName: 'John Doe',
		privacySettings: {
			private: true
		},
		interfaceSettings: {
			themeMode: ThemeMode.LIGHT,
			themeColor: ThemeColor.GREEN
		},
		followingCount: 123,
		followersCount: 456,
		followers: [
			{
				followerId: mCurrentUserId,
				followingId: 'profileId',
				status: FollowStatus.APPROVED
			}
		],
		user: {
			passwordHash: 'passwordHash'
		}
	};
	const mBaseExpectedReturn = {
		id: 'profileId',
		bio: "Hi, I'm using Twiddly !",
		role: Role.ADMIN,
		handle: 'john',
		avatar: getProfileAvatar({
			handle: 'john',
			avatarBackgroundColor: AvatarBackgroundColor.LAVENDER
		}),
		createdAt: new Date('2024-21-12 14:41AM'),
		displayName: 'John Doe',
		isPrivate: true,
		followingCount: 123,
		followersCount: 456,
		currentUserFollowStatus: FollowStatus.APPROVED
	};

	it.each([
		{
			currentUserId: mCurrentUserId,
			data: mBaseProfileData,
			expectedReturn: mBaseExpectedReturn
		},
		{
			currentUserId: mCurrentUserId,
			data: {
				...mBaseProfileData,
				avatarBackgroundColor: undefined
			},
			expectedReturn: {
				...mBaseExpectedReturn,
				avatar: getProfileAvatar({
					handle: 'john',
					avatarBackgroundColor: AvatarBackgroundColor.MISTYROSE
				})
			}
		},
		{
			currentUserId: mCurrentUserId,
			data: {
				...mBaseProfileData,
				id: undefined,
				bio: undefined,
				role: undefined,
				handle: undefined,
				createdAt: undefined,
				followers: undefined,
				displayName: undefined,
				followingCount: undefined,
				followersCount: undefined,
				avatarBackgroundColor: undefined
			},
			expectedReturn: {
				id: '',
				bio: '',
				role: Role.RESTRICTED,
				avatar: `https://api.dicebear.com/9.x/notionists-neutral/svg?backgroundColor=${getAvatarBgColor(AvatarBackgroundColor.MISTYROSE)}`,
				handle: 'unknown',
				createdAt: new Date(0),
				isPrivate: true,
				displayName: 'Unknown',
				followersCount: 0,
				followingCount: 0,
				currentUserFollowStatus: undefined
			}
		},
		{
			currentUserId: undefined,
			data: mBaseProfileData,
			expectedReturn: {
				...mBaseExpectedReturn,
				currentUserFollowStatus: undefined
			}
		}
	])('should correctly format profile %o', async ({ currentUserId, data, expectedReturn }) => {
		const result = formatProfile(data, currentUserId);

		expect(result).toEqual(expectedReturn);
	});
});

describe('getProfileSelect', () => {
	it.each([
		{
			currentUserId: 'userId',
			expectedReturn: {
				avatarBackgroundColor: true,
				bio: true,
				displayName: true,
				followers: {
					where: {
						followerId: 'userId'
					}
				},
				followersCount: true,
				followingCount: true,
				handle: true,
				id: true,
				privacySettings: {
					select: {
						private: true
					}
				},
				role: true
			}
		},
		{
			currentUserId: undefined,
			expectedReturn: {
				avatarBackgroundColor: true,
				bio: true,
				displayName: true,
				followersCount: true,
				followingCount: true,
				handle: true,
				id: true,
				privacySettings: {
					select: {
						private: true
					}
				},
				role: true
			}
		}
	])('should return expectedReturn for %o', ({ currentUserId, expectedReturn }) => {
		const result = getProfileSelect(currentUserId);

		expect(result).toEqual(expectedReturn);
	});
});
