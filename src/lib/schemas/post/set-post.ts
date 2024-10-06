import { z } from 'zod';
import { contentField, idField, sourcePostIdField } from './fields';

export const setPostSchema = z.object({
	id: idField,
	content: contentField,
	sourcePostId: sourcePostIdField
});

export type SetPostSchema = typeof setPostSchema;
