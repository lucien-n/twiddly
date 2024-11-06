import { AvatarBackgroundColor } from '@prisma/client';
import { z } from 'zod';

export const avatarBackgroundColorField = z
	.nativeEnum(AvatarBackgroundColor)
	.default(AvatarBackgroundColor.LAVENDER);

export const bioField = z.string().max(120);
