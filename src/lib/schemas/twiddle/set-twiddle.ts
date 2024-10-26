import { z } from 'zod';
import { contentField } from './fields';

export const setTwiddleSchema = z.object({
	id: z.string().length(21).optional(),
	parentId: z.string().length(21).optional(),
	content: contentField
});

export type SetTwiddlechema = typeof setTwiddleSchema;
