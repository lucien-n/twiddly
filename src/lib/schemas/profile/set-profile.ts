import { z } from 'zod';
import { displayNameField } from '../auth/fields';
import { avatarBackgroundColorField } from './fields';

export const setProfileSchema = z.object({
	displayName: displayNameField,
	avatarBackgroundColor: avatarBackgroundColorField
});

export type SetProfileSchema = typeof setProfileSchema;
