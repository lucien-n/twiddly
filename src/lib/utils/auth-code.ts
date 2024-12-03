export enum AuthCode {
	EmailAlreadyInUse = 'auth/email-already-in-use',
	InvalidCredentials = 'auth/invalid-credentials',
	InvalidHandle = 'auth/invalid-handle',
	HandleAlreadyInUse = 'auth/handle-already-in-use',
	AuthRequired = 'auth/auth-required',
	Unauthorized = 'auth/unauthorized'
}

export class AuthError extends Error {
	constructor(public code: AuthCode) {
		super(code);
		this.name = 'AuthError';
	}
}
