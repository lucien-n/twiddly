import { AvatarBackgroundColor, Role, type Profile } from '@prisma/client';

type BaseProfile = Omit<Profile, 'id'>;

export const baseProfileFixtureA: BaseProfile = {
	bio: "Hi, I'm using Twiddly !",
	role: Role.USER,
	handle: 'testuser',
	displayName: 'Test User',
	avatarBackgroundColor: AvatarBackgroundColor.LIGTH_BLUE
};
