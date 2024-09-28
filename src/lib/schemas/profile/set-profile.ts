import { z } from 'zod';
import { displayNameField } from '../auth/fields';
import { avatarBackgroundColorField } from './fields';

export const setProfileSchema = z.object({
	displayName: displayNameField.nullable(),
	avatarBackgroundColor: avatarBackgroundColorField.nullable()
});

export type SetProfileSchema = typeof setProfileSchema;
export type SetProfileInput = z.infer<SetProfileSchema>;
