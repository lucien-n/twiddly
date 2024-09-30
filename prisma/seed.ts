import { AvatarBackgroundColor, Post, PrismaClient, Role, User } from '@prisma/client';
import { generateIdFromEntropySize } from 'lucia';
import mock from './mock.json';
import { nanoid } from 'nanoid';

const getRandomInArray = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const getRandomInEnum = <T>(anEnum: T): T[keyof T] => {
	const enumValues = Object.values(anEnum as object) as unknown as T[keyof T][];
	return enumValues[Math.floor(Math.random() * enumValues.length)];
};

const emptyTables = async (db: PrismaClient) => {
	const deletes = [
		db.like.deleteMany(),
		db.post.deleteMany(),
		db.interfaceSettings.deleteMany(),
		db.privacySettings.deleteMany(),
		db.profile.deleteMany(),
		db.session.deleteMany(),
		db.user.deleteMany()
	];

	await db.$transaction(deletes);
};

const createUsers = async (db: PrismaClient): Promise<User[]> => {
	const users: User[] = [];

	const demoUser = await db.user.create({
		data: {
			id: generateIdFromEntropySize(10),
			email: 'demo@mail.com',
			passwordHash:
				'$argon2id$v=19$m=19456,t=2,p=1$3AbDA2BCtmZObHC+VFCukQ$PoRi2/772vZ6vOT4b6daKMBom+AXp3z7Xa5LVIESRbw',
			profile: {
				create: {
					displayName: 'Demo',
					handle: 'demo',
					avatarBackgroundColor: AvatarBackgroundColor.MISTYROSE,
					interfaceSettings: { create: {} },
					privacySettings: { create: {} }
				}
			}
		}
	});
	users.push(demoUser);

	const adminUser = await db.user.create({
		data: {
			id: generateIdFromEntropySize(10),
			email: 'admin@mail.com',
			passwordHash:
				'$argon2id$v=19$m=19456,t=2,p=1$3AbDA2BCtmZObHC+VFCukQ$PoRi2/772vZ6vOT4b6daKMBom+AXp3z7Xa5LVIESRbw',
			profile: {
				create: {
					displayName: 'Admin',
					handle: 'admin',
					avatarBackgroundColor: AvatarBackgroundColor.LIME,
					role: Role.ADMIN,
					interfaceSettings: { create: {} },
					privacySettings: { create: {} }
				}
			}
		}
	});
	users.push(adminUser);

	for (let i = 0; i < 5; i++) {
		const firstName = getRandomInArray(mock['firstNames']);
		const lastName = getRandomInArray(mock['lastNames']);
		const domain = getRandomInArray(mock['domains']);
		const email = `${firstName.toLocaleLowerCase()}.${lastName.toLocaleLowerCase()}-${nanoid(3)}@${domain}`;

		const user = await db.user.create({
			data: {
				id: generateIdFromEntropySize(10),
				email,
				passwordHash:
					'$argon2id$v=19$m=19456,t=2,p=1$3AbDA2BCtmZObHC+VFCukQ$PoRi2/772vZ6vOT4b6daKMBom+AXp3z7Xa5LVIESRbw',
				profile: {
					create: {
						displayName: firstName + Math.floor(Math.random() * 99).toString(),
						handle: firstName.charAt(0).toLowerCase() + lastName.toLowerCase(),
						avatarBackgroundColor: getRandomInEnum(AvatarBackgroundColor),
						interfaceSettings: { create: {} },
						privacySettings: { create: {} }
					}
				}
			}
		});
		users.push(user);
	}

	return users;
};

const seedPosts = async (db: PrismaClient, users: User[]): Promise<Post[]> => {
	const posts: Post[] = [];

	const getContent = (retries = 0, maxRetries = 8): string => {
		const content = getRandomInArray(mock['posts']);
		if (retries >= maxRetries) return content;

		const contentAlreadyUsed = posts.some((post) => post.content === content);
		return contentAlreadyUsed ? getContent(retries + 1) : content;
	};

	for (const user of users) {
		const numberOfPosts = Math.floor(Math.random() * 5) + 2; // between 2 and 6 posts
		for (let i = 0; i < numberOfPosts; i++) {
			const content = getContent();
			const createdAt = new Date();
			createdAt.setDate(-Math.floor(Math.random() * 14) + createdAt.getDate()); // past fourteen days
			createdAt.setHours(Math.floor(Math.random() * 24)); // randomize hours
			createdAt.setMinutes(Math.floor(Math.random() * 60)); // randomize minutes

			const post = await db.post.create({
				data: {
					id: nanoid(),
					content,
					authorId: user.id,
					createdAt
				}
			});
			posts.push(post);
		}
	}

	return posts;
};

const main = async () => {
	const db = new PrismaClient();

	await emptyTables(db);

	const users = await createUsers(db);
	await seedPosts(db, users);
};

main();
