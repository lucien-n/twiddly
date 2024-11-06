import { formatTwiddles } from '$lib';
import { setTwiddleSchema } from '$lib/schemas/twiddle/set-twiddle';
import { prisma } from '$lib/server/prisma';
import { getTwiddleSelect, getTwiddleWhere } from '$lib/utils/twiddle';
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
			author: { user: { deletedAt: null } },
			OR: [
				{
					AND: [{ author: { privacySettings: { private: false } } }, getTwiddleWhere()]
				},
				{
					AND: [{ authorId: currentUserId }, getTwiddleWhere()]
				}
			]
		}
	});

	return formatTwiddles(twiddles, currentUserId);
};

export const load: PageServerLoad = async (event) => ({
	twiddles: await getTwiddles(event.locals.session?.userId),
	setTwiddleForm: await superValidate(zod(setTwiddleSchema))
});
