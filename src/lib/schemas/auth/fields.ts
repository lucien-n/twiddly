import { z } from 'zod';

export const displayNameField = z
	.string()
	.min(2, { message: 'Display name must be at least 2 characters long' })
	.max(22, { message: 'Display name must be at most 22 characters long' });

export const passwordField = z
	.string()
	.min(8, { message: 'Password must be at least 8 characters long' })
	.max(96, { message: 'Password must be at most 96 characters long' })
	.regex(new RegExp(/^(?=.*[a-zA-Z])(?=.*\d).+$/));

export const emailField = z.string().email({ message: 'Invalid email address' });

export const handleField = z
	.string()
	.min(3, { message: 'Handle must be at least 3 characters long' })
	.max(22, { message: 'Handle must be at most 22 characters long' })
	.regex(/^[a-zA-Z0-9_]+$/, {
		message: 'Handle can only contain letters, numbers, and underscores'
	})
	.refine((handle) => !HANDLES_BLACKLIST.includes(handle), 'Invalid handle');

export const otpField = z
	.string()
	.length(6)
	.regex(/^[A-Z0-9]{6}$/);

export const HANDLES_BLACKLIST: string[] = [
	'settings',
	'sign-in', // ? already rejected since they contain dashes
	'sign-up', // ? already rejected since they contain dashes
	'verify',
	'actions',
	'api'
];
