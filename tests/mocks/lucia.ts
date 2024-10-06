import { vi } from 'vitest';

export const mCreateSession = vi.fn();
export const mCreateSessionCookie = vi.fn();
export const mCreateBlankSessionCookie = vi.fn();
export const mValidateSession = vi.fn();
export const mSessionCookieName = 'auth_session';

vi.mock('$lib/server/lucia', () => ({
	lucia: {
		createSession: mCreateSession,
		createSessionCookie: mCreateSessionCookie,
		createBlankSessionCookie: mCreateBlankSessionCookie,
		validateSession: mValidateSession,
		sessionCookieName: mSessionCookieName
	}
}));
