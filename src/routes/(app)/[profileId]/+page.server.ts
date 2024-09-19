import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const getProfile = async (id: string) => {
	const profile = await prisma.profile.findFirst({ where: { id } });
	if (!profile) error(404, `Profile "${id}" not found`);

	return profile;
};

export const load: PageServerLoad = async (event) => {
	const profilePromise = getProfile(event.params.profileId);

	return {
		profilePromise
	};
};
