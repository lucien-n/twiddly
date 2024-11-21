import type { PageLoad } from './$types';

export const load: PageLoad = async () => ({
	infos: {
		title: 'Settings',
		description: 'Customize your experience on Twiddly'
	}
});
