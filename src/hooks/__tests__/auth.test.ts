import { refreshSession } from '$lib/server/auth';
import { relationalProfileFixtureA } from '$tests/fixtures/profile';
import { baseUserFixtureA } from '$tests/fixtures/user';
import { mProfileFindFirst } from '$tests/mocks/prisma';
import type { RequestEvent } from '@sveltejs/kit';
import type { Session, User } from 'lucia';
import { handleAuth } from '../auth';

beforeEach(() => {
	vi.mock('$lib/server/auth', () => ({
		refreshSession: vi.fn()
	}));
});

const mResolve = vi.fn();

describe('handleAuth', () => {
	const mRefreshSession = vi.mocked(refreshSession);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should resolve with right locals if a session was found', async () => {
		const mSession = { userId: baseUserFixtureA.id } as Session;
		const mProfile = {
			...relationalProfileFixtureA,
			avatar:
				'https://api.dicebear.com/9.x/notionists-neutral/svg?seed=testuser&backgroundColor=86c9e1',
			createdAt: new Date('2024-12-12'),
			isPrivate: false,
			isFollowedByCurrentUser: false
		};

		mRefreshSession.mockResolvedValue({ user: baseUserFixtureA, session: mSession });
		mProfileFindFirst.mockResolvedValue(mProfile);

		await handleAuth({
			resolve: mResolve,
			event: { locals: {} } as RequestEvent
		});

		expect(mResolve).toHaveBeenCalledTimes(1);
		expect(mResolve).toHaveBeenCalledWith({
			locals: { user: baseUserFixtureA, session: mSession, profile: mProfile }
		});
	});

	it('should resolve with right locals if no session were found', async () => {
		mRefreshSession.mockResolvedValue({ user: null, session: null });

		await handleAuth({
			resolve: mResolve,
			event: { locals: {} } as RequestEvent
		});

		expect(mResolve).toHaveBeenCalledTimes(1);
		expect(mResolve).toHaveBeenCalledWith({
			locals: { user: null, session: null, profile: null }
		});
	});

	it("should resolve with null profile is current user's profile is not found", async () => {
		mRefreshSession.mockResolvedValue({ user: {} as User, session: {} as Session });
		mProfileFindFirst.mockResolvedValue(null);

		await handleAuth({
			resolve: mResolve,
			event: { locals: {} } as RequestEvent
		});

		expect(mResolve).toHaveBeenCalledTimes(1);
		expect(mResolve).toHaveBeenCalledWith({
			locals: { user: {}, session: {}, profile: null }
		});
	});
});
