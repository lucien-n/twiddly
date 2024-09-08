import { z } from 'zod';
import { emailField, passwordField } from './fields';

export const signInSchema = z.object({
	email: emailField,
	password: passwordField
});

export type SignInSchema = typeof signInSchema;
