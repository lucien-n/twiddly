<script lang="ts">
	import { page } from '$app/stores';
	import type { PageInfosProps } from '.';

	const { title, description, author, imageHref, imageType }: PageInfosProps = $props();
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="author" content={author ?? 'Twiddly'} />
	{#if description}
		<meta name="description" content={author} />
	{/if}
	<meta property="og:title" content={title} />
	<meta property="og:url" content={$page.url.href} />
	<meta property="og:image" content={imageHref ?? `${$page.url.origin}/favicon.svg`} />
	<meta property="og:image:type" content={imageType ?? 'image/svg'} />
</svelte:head>
