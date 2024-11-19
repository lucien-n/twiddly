<script lang="ts">
	import { TwiddleList } from '#/twiddle';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { Scrollable } from '&/scrollable';

	const { data } = $props();
</script>

<div class="flex h-screen max-h-screen flex-col">
	{#if data.twiddles.length}
		<Scrollable>
			<TwiddleList twiddles={data.twiddles} />
		</Scrollable>
	{:else if browser}
		<h1 class="mx-auto my-auto self-center text-3xl font-bold">
			{$page.params.handle ?? 'Unknown'} hasn't liked any twiddles yet
		</h1>
	{/if}
</div>
