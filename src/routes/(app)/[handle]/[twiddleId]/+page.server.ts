import { prisma } from '$lib/server/prisma';
import { getTwiddleSelect, getTwiddleWhere } from '$lib/utils/twiddle';
import { error } from 'console';
import type { PageServerLoad } from './$types';

const getTwiddle = async (id: string, currentUserId?: string) => {
	const twiddle = await prisma.twiddle.findFirst({
		where: { id, ...getTwiddleWhere() },
		select: getTwiddleSelect(currentUserId)
	});
	if (!twiddle) {
		throw error(404, "Uh oh, we couldn't find this twiddle");
	}

	return twiddle;
};

export const load: PageServerLoad = async (event) => ({
	twiddle: await getTwiddle(event.params.twiddleId, event.locals.session?.userId)
});
