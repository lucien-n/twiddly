import PageInfos from './page-infos.svelte';

interface PageInfosProps {
	title: string;
	description?: string;
	author?: string;
}

export { PageInfos, type PageInfosProps };
