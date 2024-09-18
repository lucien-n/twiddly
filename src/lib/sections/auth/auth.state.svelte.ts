import type { Session, User } from 'lucia';
import { getContext, setContext } from 'svelte';

export interface SetAuthState {
	user: User | null;
	session: Session | null;
}

export class AuthState {
	user: User | null = $state(null);
	session: Session | null = $state(null);

	openSignOutDialog: boolean = $state(false);

	constructor({ user, session }: SetAuthState) {
		this.user = user;
		this.session = session;
	}

	toggleOpenSignOutDialog() {
		this.openSignOutDialog = !this.openSignOutDialog;
	}
}

const CTX = Symbol('auth_ctx');

export const setAuthState = (init: SetAuthState): AuthState => {
	const authState = new AuthState(init);
	setContext<SetAuthState>(CTX, init);
	return authState;
};

export const getAuthState = (): AuthState => getContext<AuthState>(CTX);
