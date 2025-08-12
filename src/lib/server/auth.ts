import { getRequestEvent } from '$app/server';
import { BETTER_AUTH_URL } from '$env/static/private';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { prisma } from './prisma';

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: 'postgresql'
	}),
	baseURL: BETTER_AUTH_URL,
	plugins: [
		// make sure this is the last plugin in the array
		sveltekitCookies(getRequestEvent)
	],
	emailAndPassword: {
		enabled: true
	}
});
