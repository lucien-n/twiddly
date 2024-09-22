import { z } from 'zod';
import { themeField } from './fields';

export const setSettingsSchema = z.object({
	theme: themeField
});

export type SetSettingsSchema = typeof setSettingsSchema;
