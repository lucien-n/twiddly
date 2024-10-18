<script lang="ts">
	import type { PageInfosProps } from '.';

	const { title, description }: PageInfosProps = $props();
</script>

<svelte:head>
	<title>{title}</title>
	{#if description}
		<meta name="description" content={description} />
	{/if}
</svelte:head>
