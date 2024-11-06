<script lang="ts">
	import type { Twiddle } from '$lib';
	import { TwiddleCard, TwiddleCardSkeleton, TwiddleContext } from '.';

	interface Props {
		twiddles: Twiddle[] | Promise<Twiddle[]>;
	}
	const { twiddles }: Props = $props();
</script>

{#snippet twiddlesList(data: Twiddle[])}
	{#each data as twiddle (twiddle.data.id)}
		<TwiddleContext init={twiddle}>
			{#snippet children(twiddleState)}
				{#if !twiddleState.deleted}
					<TwiddleCard twiddle={twiddleState} />
				{/if}
			{/snippet}
		</TwiddleContext>
	{/each}
{/snippet}

{#if twiddles instanceof Promise}
	{#await twiddles}
		<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
		{#each { length: 5 } as _}
			<TwiddleCardSkeleton />
		{/each}
	{:then data}
		{@render twiddlesList(data)}
	{/await}
{:else}
	{@render twiddlesList(twiddles)}
{/if}
