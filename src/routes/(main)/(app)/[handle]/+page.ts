import { getProfileAvatar } from '$lib/utils/avatar';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => ({
	...data,
	infos: {
		title: `${data.profile.displayName}'s profile`,
		description: `${data.profile.displayName}'s profile & latest posts`,
		author: data.profile.handle,
		image: getProfileAvatar(data.profile)
	}
});
