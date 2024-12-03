import { FollowStatus } from '@prisma/client';
import { z } from 'zod';

export const updateFollowRequestSchema = z.object({
	status: z.nativeEnum(FollowStatus)
});
