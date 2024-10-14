import { z } from 'zod';

export const contentField = z.string().min(1).max(320);
