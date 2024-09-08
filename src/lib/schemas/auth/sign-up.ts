import { z } from 'zod';
import { passwordField, emailField, usernameField } from './fields';

export const signUpSchema = z.object({
	password: passwordField,
	email: emailField,
	username: usernameField
});

export type SignUpSchema = typeof signUpSchema;
