import { z } from 'zod';
import { contentField } from './fields';

export const createPostSchema = z.object({
	content: contentField
});

export type CreatePostSchema = typeof createPostSchema;
