import { z } from 'zod';

export const usernameField = z.string().min(2).max(22).regex(new RegExp(`^[a-zA-Z0-9]+$`));

export const passwordField = z
	.string()
	.min(8)
	.max(96)
	.regex(new RegExp(/^(?=.*[a-zA-Z])(?=.*\d).+$/));

export const emailField = z.string().email();
