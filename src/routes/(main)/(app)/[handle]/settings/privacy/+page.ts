import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => ({
	...data,
	infos: {
		title: 'Privacy Settings',
		description: 'Control everything related to your privacy on Twiddly'
	}
});
