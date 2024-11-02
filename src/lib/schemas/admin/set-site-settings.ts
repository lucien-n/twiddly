import { MaintenanceMode } from '@prisma/client';
import { z } from 'zod';

export const adminSetSiteSettingsSchema = z.object({
	maintenanceMode: z.nativeEnum(MaintenanceMode)
});

export type AdminSetSiteSettingsSchema = typeof adminSetSiteSettingsSchema;
