<script lang="ts">
	import { TwiddleList } from '#/twiddle';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	const { data } = $props();
</script>

{#if data.twiddles.length}
	<TwiddleList twiddles={data.twiddles} />
{:else if browser}
	<h1 class="mx-auto my-auto self-center text-3xl font-bold">
		{$page.params.handle ?? 'Unknown'} hasn't twiddled yet
	</h1>
{/if}
