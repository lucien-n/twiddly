import { Theme } from '@prisma/client';
import { z } from 'zod';

export const themeField = z.nativeEnum(Theme);
