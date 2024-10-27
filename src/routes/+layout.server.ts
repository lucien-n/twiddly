import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => ({
	user: event.locals.user,
	session: event.locals.session,
	profile: event.locals.profile,
	infos: {
		title: 'Twiddly'
	}
});
