import { ThemeColor, ThemeMode } from '@prisma/client';
import { z } from 'zod';

export const setInterfaceSettingsSchema = z.object({
	themeMode: z.nativeEnum(ThemeMode).default(ThemeMode.SYSTEM),
	themeColor: z.nativeEnum(ThemeColor).default(ThemeColor.DEFAULT)
});

export type SetInterfaceSettingsSchema = typeof setInterfaceSettingsSchema;

export const setPrivacySettingsSchema = z.object({
	private: z.boolean().default(false)
});

export type SetPrivacySettingsSchema = typeof setPrivacySettingsSchema;
