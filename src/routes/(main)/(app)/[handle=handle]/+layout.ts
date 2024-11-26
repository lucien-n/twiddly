import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => ({
	...data,
	infos: {
		title: `${data.profile.displayName}'s profile`,
		description: `${data.profile.displayName}'s profile & activity`,
		author: data.profile.handle,
		image: data.profile.avatar
	}
});
