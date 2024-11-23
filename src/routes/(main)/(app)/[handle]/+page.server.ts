import { route } from '$lib/ROUTES.js';
import { redirect } from '@sveltejs/kit';

export const load = (event) => {
	redirect(303, route('/[handle]/activity', { handle: event.params.handle }));
};
