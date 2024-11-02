import { AvatarBackgroundColor } from '@prisma/client';
import { z } from 'zod';

export const avatarBackgroundColorField = z
	.nativeEnum(AvatarBackgroundColor)
	.default(AvatarBackgroundColor.LAVENDER);
