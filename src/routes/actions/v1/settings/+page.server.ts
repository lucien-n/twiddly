import { setInterfaceSettings, setPrivacySettings } from '$lib/actions/settings';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	setPrivacySettings,
	setInterfaceSettings
};
