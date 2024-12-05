import { z } from 'zod';

const followAction = ['APPROVE', 'CANCEL'] as const;
export type FollowAction = (typeof followAction)[number];

export const updateFollowRequestSchema = z.object({
	action: z.enum(followAction)
});
