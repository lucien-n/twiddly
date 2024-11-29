import { formatTwiddles, getTwiddleSelect, getTwiddleWhere } from '$lib/models';
import { setTwiddleSchema } from '$lib/schemas/twiddle/set-twiddle';
import { prisma } from '$lib/server/prisma';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

const getTwiddles = async (currentUserId?: string) => {
	const twiddles = await prisma.twiddle.findMany({
		orderBy: { createdAt: 'desc' },
		select: {
			...getTwiddleSelect(currentUserId),
			parent: { select: getTwiddleSelect(currentUserId) }
		},
		where: {
			...getTwiddleWhere(),
			OR: [{ author: { privacySettings: { private: false } } }, { authorId: currentUserId }]
		}
	});

	return formatTwiddles(twiddles, currentUserId);
};

export const load: PageServerLoad = async (event) => {
	const [twiddles, setTwiddleForm] = await Promise.all([
		getTwiddles(event.locals.session?.userId),
		superValidate(zod(setTwiddleSchema))
	]);

	return {
		twiddles,
		setTwiddleForm
	};
};
