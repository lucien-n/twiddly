<script lang="ts">
	import { TwiddleList } from '#/twiddle';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	const { data } = $props();
</script>

<TwiddleList twiddles={data.twiddlesPromise}>
	{#snippet empty({ props })}
		{@const handle = (browser ? $page.params.handle : undefined) ?? 'Unknown'}

		<h1 {...props}>
			{#if data.profile.isPrivate}
				{handle}'s profile is private
			{:else}
				{handle} hasn't liked any twiddles yet
			{/if}
		</h1>
	{/snippet}
</TwiddleList>
