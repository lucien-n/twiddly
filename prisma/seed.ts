import { AvatarBackgroundColor, PrismaClient, Role, Twiddle, User } from '@prisma/client';
import { generateIdFromEntropySize } from 'lucia';
import mock from './mock.json';
import { nanoid } from 'nanoid';

const getRandomInArray = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const getRandomInEnum = <T>(anEnum: T): T[keyof T] => {
	const enumValues = Object.values(anEnum as object) as unknown as T[keyof T][];
	return enumValues[Math.floor(Math.random() * enumValues.length)];
};

const getRandomDateBetweenNowAndThen = (thenDays: number = 14): Date => {
	const date = new Date();
	date.setDate(-Math.floor(Math.random() * thenDays) + date.getDate()); // past n days
	date.setHours(Math.floor(Math.random() * 24)); // randomize hours
	date.setMinutes(Math.floor(Math.random() * 60)); // randomize minutes

	return date;
};

const emptyTables = async (db: PrismaClient) =>
	db.$transaction([
		db.like.deleteMany(),
		db.twiddle.deleteMany(),
		db.interfaceSettings.deleteMany(),
		db.privacySettings.deleteMany(),
		db.profile.deleteMany(),
		db.session.deleteMany(),
		db.user.deleteMany(),
		db.handleBlacklist.deleteMany()
	]);

const seedHandleBlacklist = async (db: PrismaClient): Promise<void> => {
	const baseBlacklist: string[] = ['settings', 'sign-in', 'sign-up', 'verify', 'actions', 'api'];

	await db.handleBlacklist.createMany({ data: baseBlacklist.map((handle) => ({ handle })) });
};

const createUsers = async (db: PrismaClient): Promise<User[]> => {
	const users: User[] = [];

	const demoUser = await db.user.create({
		data: {
			id: generateIdFromEntropySize(10),
			email: 'demo@mail.com',
			emailVerified: true,
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
			emailVerified: true,
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
				emailVerified: true,
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

const seedTwiddles = async (db: PrismaClient, users: User[]): Promise<Twiddle[]> => {
	const twiddles: Twiddle[] = [];

	const getContent = (retries = 0, maxRetries = 5): string => {
		const content = getRandomInArray(mock['twiddles']);
		if (retries >= maxRetries) return content;

		const contentAlreadyUsed = twiddles.some((twiddle) => twiddle.content === content);
		return contentAlreadyUsed ? getContent(retries + 1) : content;
	};

	for (const user of users) {
		const numberOfTwiddles = Math.floor(Math.random() * 8) + 3; // between 3 and 9 twiddles
		for (let i = 0; i < numberOfTwiddles; i++) {
			const content = getContent();
			const createdAt = getRandomDateBetweenNowAndThen(14);

			const twiddle = await db.twiddle.create({
				data: {
					id: nanoid(),
					content,
					authorId: user.id,
					createdAt,
					editedAt: Math.random() > 0.9 ? getRandomDateBetweenNowAndThen(14) : null, // 10% chance to be an edited twiddle
					deletedAt: Math.random() > 0.95 ? getRandomDateBetweenNowAndThen(14) : null // 5% chance to be a deleted twiddle
				}
			});
			twiddles.push(twiddle);
		}
	}

	return twiddles;
};

const main = async () => {
	const db = new PrismaClient();

	await emptyTables(db);

	await seedHandleBlacklist(db);
	const users = await createUsers(db);
	await seedTwiddles(db, users);
};

main();
