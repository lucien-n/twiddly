import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => ({
	...data,
	infos: {
		title: 'Twiddly',
		description: 'Interact with the latest twiddles'
	}
});
