import type { PageLoad } from './$types';

export const load: PageLoad = ({ data }) => ({
	...data,
	infos: {
		title: 'Sign Up',
		description: 'Join Twiddly by creating your twiddler profile'
	}
});
