import { prisma } from '$lib/server/prisma';
import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPostSelect } from '$lib/utils/post';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { setProfileSchema } from '$lib/schemas/profile/set-profile';
import { dev } from '$app/environment';
import { getProfileSelect } from '$lib/utils/profile';

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
			where: { authorId: profile.id, deleted: { not: true } },
			select: getPostSelect(event.locals.session?.userId),
			take: 10
		})
		.then((posts) => posts.map((post) => ({ ...post, author: profile })));

	return {
		profile,
		postsPromise,
		setProfileForm: await superValidate(profile, zod(setProfileSchema))
	};
};

export const actions: Actions = {
	setProfile: async (event) => {
		if (!event.locals.session) return fail(401);

		const form = await superValidate(event, zod(setProfileSchema));
		if (!form.valid) {
			return fail(400, { setProfileForm: form });
		}

		const { displayName, avatarBackgroundColor } = form.data;
		try {
			await prisma.profile.update({
				data: {
					displayName,
					avatarBackgroundColor
				},
				where: { id: event.locals.session.userId },
				select: { id: true }
			});
		} catch (e) {
			if (dev) console.error(e);

			error(500, { message: 'An error occured' });
		}
	}
};
