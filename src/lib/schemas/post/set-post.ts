import { z } from 'zod';
import { contentField } from './fields';

export const setPostSchema = z.object({
	id: z.string().length(21).optional(),
	content: contentField
});

export type SetPostSchema = typeof setPostSchema;
