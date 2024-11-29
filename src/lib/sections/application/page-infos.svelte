<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_ORIGIN } from '$env/static/public';

	const infos = $derived($page.data.infos);

	const siteName = 'Twiddly';
	const description = $derived(infos?.description ?? 'Twiddly - Share and connect with your peers');
</script>

<svelte:head>
	<title>{infos?.title ?? siteName}</title>
	<meta name="author" content={infos?.author ?? siteName} />
	<meta name="description" content={description} />
	<meta name="og:description" content={description} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:title" content={infos?.title ?? siteName} />
	<meta property="og:image" content={infos?.image ?? `${PUBLIC_ORIGIN}/favicon.png`} />
	<meta property="og:image:type" content={infos?.imageType ?? 'image/png'} />
	<meta property="og:url" content={$page.url.href} />
</svelte:head>
