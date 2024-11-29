import { formatTwiddle, getTwiddleSelect, getTwiddleWhere } from '$lib/models';
import { prisma } from '$lib/server/prisma';
import { error } from 'console';
import type { PageServerLoad } from './$types';

const getTwiddle = async (id: string, currentUserId?: string) => {
	const twiddle = await prisma.twiddle.findFirst({
		where: { id, ...getTwiddleWhere() },
		select: {
			...getTwiddleSelect(currentUserId),
			children: {
				select: getTwiddleSelect(currentUserId),
				where: getTwiddleWhere(),
				orderBy: { createdAt: 'desc' }
			},
			parent: { select: getTwiddleSelect(currentUserId) }
		}
	});
	if (!twiddle) {
		throw error(404, "Uh oh, we couldn't find this twiddle");
	}

	return formatTwiddle(twiddle, currentUserId);
};

export const load: PageServerLoad = async (event) => {
	const twiddle = getTwiddle(event.params.twiddleId, event.locals.session?.userId);

	return {
		twiddle
	};
};
