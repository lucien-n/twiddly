import { prisma } from '$lib/server/prisma';
import { getTwiddleSelect, getTwiddleWhere } from '$lib/utils/twiddle';
import { error } from 'console';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { setTwiddleSchema } from '$lib/schemas/twiddle/set-twiddle';

const getTwiddle = async (id: string, currentUserId?: string) => {
	const twiddle = await prisma.twiddle.findFirst({
		where: { id, ...getTwiddleWhere() },
		select: {
			...getTwiddleSelect(currentUserId),
			children: { select: getTwiddleSelect(currentUserId) }
		}
	});
	if (!twiddle) {
		throw error(404, "Uh oh, we couldn't find this twiddle");
	}

	return twiddle;
};

export const load: PageServerLoad = async (event) => {
	const twiddle = await getTwiddle(event.params.twiddleId, event.locals.session?.userId);

	return {
		twiddle,
		setCommentForm: await superValidate({ parentId: twiddle.id }, zod(setTwiddleSchema))
	};
};
