import type { PageLoad } from './$types';

export const load: PageLoad = ({ data }) => ({
	...data,
	infos: {
		title: 'Verify',
		description: 'Verify the OTP (one time password) sent to your email address'
	}
});
