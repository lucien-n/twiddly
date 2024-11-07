import { z } from 'zod';

export const MAX_CONTENT_LENGTH = 320;

export const contentField = z.string().min(1);
