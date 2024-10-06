import { AvatarBackgroundColor, Role, type Profile } from '@prisma/client';

type BaseProfile = Omit<Profile, 'id'>;

export const baseProfileFixtureA: BaseProfile = {
	handle: 'testuser',
	displayName: 'Test User',
	avatarBackgroundColor: AvatarBackgroundColor.LIGTH_BLUE,
	role: Role.USER
};
