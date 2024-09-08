export enum AuthErrorCode {
	EmailAlreadyInUse = 'auth/email-already-in-use',
	InvalidCredentials = 'auth/invalid-credentials'
}

export class AuthError extends Error {
	constructor(public code: AuthErrorCode) {
		super(code);
		this.name = 'AuthError';
	}
}
