import { z } from 'zod';
import { passwordField, emailField, displayNameField, handleField } from './fields';

export const signUpSchema = z.object({
	password: passwordField,
	email: emailField,
	displayName: displayNameField,
	handle: handleField
});

export type SignUpSchema = typeof signUpSchema;
