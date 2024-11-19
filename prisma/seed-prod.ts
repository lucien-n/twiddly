import { MaintenanceMode, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const HANDLES_BLACKLIST: string[] = [
	'sign-in',
	'sign-up',
	'sitemaps.xml',
	'verify',
	'actions',
	'api'
];

async function seedSiteSettings() {
	console.log('seeding site settings');

	const siteSettings = await prisma.siteSettings.findFirst();
	if (siteSettings) return;

	await prisma.siteSettings.create({ data: { maintenanceMode: MaintenanceMode.OPEN } });
}

async function seedHandleBlacklist() {
	console.log('seeding handle blacklist');

	const blacklistedHandles = (await prisma.handleBlacklist.findMany()).map(({ handle }) => handle);
	const missingHandles = HANDLES_BLACKLIST.filter((handle) => !blacklistedHandles.includes(handle));

	if (!missingHandles.length) return;

	await prisma.handleBlacklist.createMany({
		data: missingHandles.map((missingHandle) => ({ handle: missingHandle }))
	});
}

await (async function () {
	await seedSiteSettings();
	await seedHandleBlacklist();
})();
