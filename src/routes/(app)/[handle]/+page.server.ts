import { dev } from '$app/environment';
import { setProfileSchema, type SetProfileInput } from '$lib/schemas/profile/set-profile';
import { prisma } from '$lib/server/prisma';
import { getPostSelect } from '$lib/utils/post';
import { getProfileSelect } from '$lib/utils/profile';
import { error, type Actions } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
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
			where: { authorId: profile.id, OR: [{ deleted: false }, { deleted: null }] },
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

		const currentProfile = await prisma.profile.findUnique({
			where: { id: event.locals.session.userId },
			select: {
				displayName: true,
				avatarBackgroundColor: true
			}
		});

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const updatedData: any = Object.fromEntries(
			Object.entries(form.data).filter(
				([field, value]) => value !== currentProfile?.[field as keyof SetProfileInput]
			)
		);
		if (Object.keys(updatedData).length === 0) {
			return { setProfileForm: form };
		}

		try {
			await prisma.profile.update({
				data: updatedData,
				where: { id: event.locals.session.userId },
				select: {
					id: true // EMPTY QUERY
				}
			});
		} catch (e) {
			if (dev) console.error(e);

			error(500, { message: 'An error occured' });
		}
	}
};
