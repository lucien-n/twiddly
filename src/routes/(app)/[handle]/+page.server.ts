import { setProfileSchema } from '$lib/schemas/profile/set-profile';
import { prisma } from '$lib/server/prisma';
import { getPostOrderBy, getPostSelect, getPostWhere } from '$lib/utils/post';
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

	const postsPromise = prisma.post
		.findMany({
			select: getPostSelect(event.locals.session?.userId),
			where: getPostWhere({ authorId: profile.id }),
			orderBy: getPostOrderBy(),
			take: 10
		})
		.then((posts) => posts.map((post) => ({ ...post, author: profile })));

	return {
		profile,
		postsPromise,
		setProfileForm: await superValidate(profile, zod(setProfileSchema))
	};
};
