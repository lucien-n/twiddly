<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_ORIGIN } from '$env/static/public';

	const infos = $derived($page.data.infos);

	const description = $derived(infos?.description ?? 'Twiddly - Share and connect with your peers');
</script>

<svelte:head>
	<title>{infos?.title ?? 'Twiddly'}</title>
	<meta name="author" content={infos?.author ?? 'Twiddly'} />
	<meta name="description" content={description} />
	<meta name="og:description" content={description} />
	<meta property="og:site_name" content="Twiddly" />
	<meta property="og:title" content={infos?.title ?? 'Twiddly'} />
	<meta property="og:image" content={infos?.image ?? `${PUBLIC_ORIGIN}/favicon.png`} />
	<meta property="og:image:type" content={infos?.imageType ?? 'image/png'} />
	<meta property="og:url" content={$page.url.href} />
</svelte:head>
