import { CRON_SECRET } from '$env/static/private';
import { prisma } from '$lib/server/prisma';
import { error, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	const bearer = (event.request.headers.get('authorization') || '').split('Bearer ').at(1);

	if (!bearer || bearer != CRON_SECRET) {
		return error(401);
	}

	try {
		const onMonthAgo = new Date();
		onMonthAgo.setDate(onMonthAgo.getDate() - 30);

		await prisma.user.deleteMany({ where: { deletedAt: { lte: onMonthAgo } } });
	} catch (e) {
		console.error(e);

		return error(500);
	}

	return new Response();
};
