import { refreshSession } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import { formatProfile } from '@/lib/models';
import type { Handle } from '@sveltejs/kit';

export const handleAuth: Handle = async ({ resolve, event }) => {
	const { user, session } = await refreshSession(event);

	event.locals.user = user;
	event.locals.session = session;

	if (session) {
		const profileData = await prisma.profile.findFirst({
			where: { id: session.userId },
			include: { interfaceSettings: true, privacySettings: true }
		});

		event.locals.profile = profileData ? { ...profileData, ...formatProfile(profileData) } : null;
	} else {
		event.locals.profile = null;
	}

	return resolve(event);
};
