import { setProfileSchema } from '$lib/schemas/profile/set-profile';
import { prisma } from '$lib/server/prisma';
import { getTwiddleOrderBy, getTwiddleSelect, getTwiddleWhere } from '$lib/utils/twiddle';
import { getProfileSelect } from '$lib/utils/profile';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { handle } = event.params;

	const profile = await prisma.profile.findFirst({
		where: { handle },
		select: getProfileSelect()
	});
	if (!profile) error(404, `Profile @${handle} not found`);
	if (profile.privacySettings?.private && profile.id !== event.locals.session?.userId)
		error(401, `@${handle}'s profile is private`);

	const twiddlesPromise = prisma.twiddle
		.findMany({
			select: getTwiddleSelect(event.locals.session?.userId),
			where: getTwiddleWhere({ authorId: profile.id }),
			orderBy: getTwiddleOrderBy(),
			take: 10
		})
		.then((twiddles) => twiddles.map((twiddle) => ({ ...twiddle, author: profile })));

	return {
		profile,
		twiddlesPromise,
		setProfileForm: await superValidate(profile, zod(setProfileSchema))
	};
};
