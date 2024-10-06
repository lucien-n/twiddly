import { z } from 'zod';

export const contentField = z.string().min(1).max(320);
export const idField = z.string().length(21).optional();
export const sourcePostIdField = z.string().length(21).nullable().default(null);
