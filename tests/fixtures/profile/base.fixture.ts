import { AvatarBackgroundColor, Role, type Profile } from '@prisma/client';

type BaseProfile = Omit<Profile, 'id'>;

export const baseProfileFixtureA: BaseProfile = {
	bio: "Hi, I'm using Twiddly !",
	role: Role.USER,
	handle: 'testuser',
	displayName: 'Test User',
	avatarBackgroundColor: AvatarBackgroundColor.LIGTH_BLUE,
	followersCount: 0,
	followingCount: 0
};

export const baseProfileFixtureB: BaseProfile = {
	bio: 'Twiddly is fire',
	role: Role.USER,
	handle: 'john_doe',
	displayName: 'John Doe',
	avatarBackgroundColor: AvatarBackgroundColor.LAVENDER,
	followersCount: 0,
	followingCount: 0
};
