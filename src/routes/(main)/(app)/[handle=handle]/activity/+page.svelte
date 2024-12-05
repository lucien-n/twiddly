<script lang="ts">
	import { TwiddleList } from '#/twiddle';
	import { page } from '$app/stores';

	const { data } = $props();
</script>

<TwiddleList twiddles={data.twiddlesPromise}>
	{#snippet empty({ props })}
		{@const handle = $page.params.handle ?? 'Unknown'}

		<h1 {...props}>
			{#if data.profile.isPrivate}
				{handle}'s profile is private
			{:else}
				{handle} hasn't twiddled yet
			{/if}
		</h1>
	{/snippet}
</TwiddleList>
