import MaintenanceModeAlert from './maintenance-mode-alert.svelte';
import PageInfos from './page-infos.svelte';

interface PageInfosProps {
	title: string;
	description?: string;
	author?: string;
	image?: string;
	imageType?: string;
}

export { MaintenanceModeAlert, PageInfos, type PageInfosProps };
