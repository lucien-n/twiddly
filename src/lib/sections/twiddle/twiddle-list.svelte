<script lang="ts">
	import type { Twiddle } from '$lib/models';
	import type { Snippet } from 'svelte';
	import { TwiddleCard, TwiddleCardSkeleton, TwiddleContext } from '.';

	interface EmptySnippetProps {
		props: { class: string };
	}

	interface Props {
		twiddles: Twiddle[] | Promise<Twiddle[]>;
		empty?: Snippet<[EmptySnippetProps]>;
	}
	const { twiddles, empty }: Props = $props();

	const emptySnippetProps: EmptySnippetProps = {
		props: {
			class: 'text-center text-3xl font-bold'
		}
	};
</script>

{#snippet twiddlesList(data: Twiddle[])}
	{#if data.length}
		{#each data as twiddle (twiddle.data.id)}
			<TwiddleContext init={twiddle}>
				{#snippet children(twiddleState)}
					{#if !twiddleState.deleted}
						<TwiddleCard twiddle={twiddleState} />
					{/if}
				{/snippet}
			</TwiddleContext>
		{/each}
	{:else if empty}
		{@render empty(emptySnippetProps)}
	{:else}
		<h1 {...emptySnippetProps}>No twiddles</h1>
	{/if}
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
