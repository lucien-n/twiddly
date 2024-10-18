import { getProfileAvatar } from '$lib/utils/avatar';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ data }) => ({
	...data,
	infos: {
		title: `${data.twiddle.author.displayName} on Twiddly: ${data.twiddle.content}`,
		description: data.twiddle.content,
		author: data.twiddle.author.handle,
		image: getProfileAvatar(data.twiddle.author)
	}
});
