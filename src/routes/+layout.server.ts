import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = (event) => ({
	user: event.locals.user,
	session: event.locals.session
});
