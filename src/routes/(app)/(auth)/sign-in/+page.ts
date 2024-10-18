import type { PageLoad } from './$types';

export const load: PageLoad = ({ data }) => ({
	...data,
	infos: {
		title: 'Sign In',
		description: 'Sign in to your Twiddly account'
	}
});
