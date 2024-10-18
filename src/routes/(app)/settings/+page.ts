import type { PageLoad } from './$types';

export const load: PageLoad = async () => ({
	infos: {
		title: 'Settingss',
		description: 'Customize your experience on Twiddly'
	}
});
