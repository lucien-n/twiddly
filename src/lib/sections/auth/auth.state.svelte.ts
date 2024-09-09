import type { Session, User } from 'lucia';
import { getContext, setContext } from 'svelte';

export interface SetAuthState {
	user: User | null;
	session: Session | null;
}

export class AuthState {
	user: User | null = $state(null);
	session: Session | null = $state(null);

	constructor({ user, session }: SetAuthState) {
		this.user = user;
		this.session = session;
	}
}

const AUTH_KEY = Symbol('auth_ctx');

export const getAuthState = (): AuthState => getContext<AuthState>(AUTH_KEY);

export const setAuthState = (init: SetAuthState) => setContext<AuthState>(AUTH_KEY, init);
