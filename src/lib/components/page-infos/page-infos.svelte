<script lang="ts">
	import { page } from '$app/stores';

	const infos = $derived($page.data.infos);
</script>

<svelte:head>
	<title>{infos.title}</title>
	<meta name="author" content={infos.author ?? 'Twiddly'} />
	<meta
		name="description"
		content={infos.description ?? 'Twiddly - Share and connect with your peers'}
	/>
	<meta property="og:title" content={infos.title} />
	<meta property="og:image" content={infos.image ?? `${$page.url.origin}/favicon.svg`} />
	<meta property="og:image:type" content={infos.imageType ?? 'image/svg'} />
	<meta property="og:url" content={$page.url.href} />
</svelte:head>
