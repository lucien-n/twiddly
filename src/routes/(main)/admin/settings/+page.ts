import type { PageLoad } from './$types';

export const load: PageLoad = async () => ({
	infos: {
		title: 'Admin - Settings'
	}
});
