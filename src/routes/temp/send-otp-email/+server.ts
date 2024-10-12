import { sendOTPVerificationEmail } from '$lib/server/email';
import type { RequestHandler } from '@sveltejs/kit';
import { alphabet, generateRandomString } from 'oslo/crypto';

export const GET: RequestHandler = async () => {
	const code = generateRandomString(6, alphabet('0-9', 'A-Z'));
	const success = await sendOTPVerificationEmail(code, {
		email: 'contact@lucienn.dev',
		name: 'Lucien'
	});

	if (!success) throw new Error('Failed');

	return new Response();
};
