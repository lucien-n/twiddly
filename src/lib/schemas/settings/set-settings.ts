import { Theme } from '@prisma-app/client';
import { z } from 'zod';

export const setInterfaceSettingsSchema = z.object({
	theme: z.nativeEnum(Theme).default(Theme.SYSTEM)
});

export type SetInterfaceSettingsSchema = typeof setInterfaceSettingsSchema;

export const setPrivacySettingsSchema = z.object({
	private: z.boolean().default(false)
});

export type SetPrivacySettingsSchema = typeof setPrivacySettingsSchema;
