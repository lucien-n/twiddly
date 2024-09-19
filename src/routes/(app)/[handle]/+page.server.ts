import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const getProfile = async (handle: string) => {
	const profile = await prisma.profile.findFirst({ where: { handle } });
	if (!profile) error(404, `Profile @${handle} not found`);

	return profile;
};

export const load: PageServerLoad = async (event) => {
	const profilePromise = getProfile(event.params.handle);

	return {
		profilePromise
	};
};
