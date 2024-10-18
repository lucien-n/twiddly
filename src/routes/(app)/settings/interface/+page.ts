import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => ({
	...data,
	infos: {
		title: 'Inferface Settings',
		description: 'Customize how Twiddly is presented to you'
	}
});
