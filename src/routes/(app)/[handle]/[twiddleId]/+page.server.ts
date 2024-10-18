import { prisma } from '$lib/server/prisma';
import { getTwiddleSelect, getTwiddleWhere } from '$lib/utils/twiddle';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => ({
	twiddle: await prisma.twiddle.findFirst({
		where: { id: event.params.twiddleId, ...getTwiddleWhere() },
		select: getTwiddleSelect(event.locals.session?.userId)
	})
});
