import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, parent }) => {
	const { profile } = await parent();
	return {
		...data,
		infos: {
			title: `${profile.displayName}'s liked twiddles`,
			description: `${profile.displayName}'s liked twiddles`,
			author: profile.handle,
			image: profile.avatar
		}
	};
};
