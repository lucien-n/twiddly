export enum AuthErrorCode {
	EmailAlreadyInUse = 'auth/email-already-in-use',
	InvalidCredentials = 'auth/invalid-credentials',
	InvalidHandle = 'auth/invalid-handle',
	HandleAlreadyInUse = 'auth/handle-already-in-use',
	AuthRequired = 'auth/auth-required',
	Unauthorized = 'auth/Unauthorized'
}

export class AuthError extends Error {
	constructor(public code: AuthErrorCode) {
		super(code);
		this.name = 'AuthError';
	}
}
