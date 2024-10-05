import { signIn, signUp } from '$lib/actions/auth';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	signIn,
	signUp
};
