import { formatTwiddles, getTwiddleSelect, getTwiddleWhere } from '$lib/models';
import { setTwiddleSchema } from '$lib/schemas/twiddle/set-twiddle';
import { prisma } from '$lib/server/prisma';
import { isVerified } from '@/lib/server/auth';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { getTabFromParam, type HomeTab } from './types';

const getTwiddles = async (tab: HomeTab, currentUserId?: string) => {
	const where =
		tab === 'discover'
			? { OR: [{ author: { privacySettings: { private: false } } }, { authorId: currentUserId }] }
			: {
					author: {
						followers: { some: { followerId: currentUserId } }
					}
				};

	const twiddles = await prisma.twiddle.findMany({
		orderBy: { createdAt: 'desc' },
		select: {
			...getTwiddleSelect(currentUserId),
			parent: { select: getTwiddleSelect(currentUserId) }
		},
		where: {
			...getTwiddleWhere(),
			...where
		},
		take: 10
	});

	return formatTwiddles(twiddles, currentUserId);
};

export const load: PageServerLoad = async (event) => {
	const tab = isVerified(event) ? getTabFromParam(event.url.searchParams.get('tab')) : 'discover';

	const twiddlesPromise = getTwiddles(tab, event.locals.session?.userId);
	const setTwiddleForm = await superValidate(zod(setTwiddleSchema));

	return {
		twiddlesPromise,
		setTwiddleForm
	};
};
