import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, parent }) => {
	const { profile } = await parent();
	return {
		...data,
		infos: {
			title: `${profile.displayName}'s activity`,
			description: `${profile.displayName}'s activity`,
			author: profile.handle,
			image: profile.avatar
		}
	};
};
