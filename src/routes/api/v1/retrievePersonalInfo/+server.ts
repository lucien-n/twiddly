import { dev } from '$app/environment';
import { route } from '$lib/ROUTES';
import { isVerified } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';

// todo: check when the user last retrieved their data/send an email with said data instead of direct download
export const GET = async (event) => {
	if (!isVerified(event)) {
		return redirect(302, route('/'));
	}

	try {
		const data = await prisma.user.update({
			data: { dataLastRetrievedAt: new Date() },
			where: { id: event.locals.session.userId },
			include: {
				profile: {
					include: { interfaceSettings: true, privacySettings: true, likes: true, twiddles: true }
				}
			}
		});

		return new Response(JSON.stringify(data, null, 2), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Content-Disposition': 'attachment; filename="data.json"'
			}
		});
	} catch (e) {
		if (dev) console.error(e);

		throw new Error('An unexpected error occured');
	}
};
