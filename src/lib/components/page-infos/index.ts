import PageInfos from './page-infos.svelte';

interface PageInfosProps {
	title: string;
	description?: string;
	author?: string;
	imageHref?: string;
	imageType?: string;
}

export { PageInfos, type PageInfosProps };
