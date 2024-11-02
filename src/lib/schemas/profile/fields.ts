import { AvatarBackgroundColor } from '@prisma-app/client';
import { z } from 'zod';

export const avatarBackgroundColorField = z
	.nativeEnum(AvatarBackgroundColor)
	.default(AvatarBackgroundColor.LAVENDER);
