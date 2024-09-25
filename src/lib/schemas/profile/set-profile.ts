import { z } from 'zod';
import { displayNameField } from '../auth/fields';

export const setProfileSchema = z.object({
	displayName: displayNameField
});

export type SetProfileSchema = typeof setProfileSchema;
