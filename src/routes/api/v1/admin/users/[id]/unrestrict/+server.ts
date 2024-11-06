import { dev } from '$app/environment';
import { isAdmin } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import { Role } from '@prisma/client';
import { error, redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	if (!isAdmin(event)) return redirect(303, '/');

	const { id: profileId } = event.params;

	try {
		await prisma.profile.update({
			data: { role: Role.USER },
			where: { id: profileId, role: Role.RESTRICTED }
		});
	} catch (e) {
		if (dev) {
			console.error(e);
		}

		return error(500, 'An unexpected error occured');
	}

	return new Response();
};
