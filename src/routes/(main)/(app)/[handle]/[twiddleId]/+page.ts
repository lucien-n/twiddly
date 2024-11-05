import { getProfileAvatar } from '$lib/utils/avatar';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ data }) => ({
	...data,
	infos: {
		title: `${data.twiddle.data.author.displayName} on Twiddly: ${data.twiddle.data.content}`,
		description: data.twiddle.data.content,
		author: data.twiddle.data.author.handle,
		image: getProfileAvatar(data.twiddle.data.author)
	}
});
