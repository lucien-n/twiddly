import { z } from 'zod';
import { passwordField, emailField, displayNameField } from './fields';

export const signUpSchema = z.object({
	password: passwordField,
	email: emailField,
	displayName: displayNameField
});

export type SignUpSchema = typeof signUpSchema;
