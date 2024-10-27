<script lang="ts">
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { TwiddleCard, TwiddleCardSkeleton, TwiddleContext } from '.';
	import type { SetTwiddlechema } from '$lib/schemas/twiddle/set-twiddle';
	import type { Twiddle } from '$lib';

	interface Props {
		twiddles: Twiddle[] | Promise<Twiddle[]>;
		setTwiddleForm: SuperValidated<Infer<SetTwiddlechema>>;
	}
	const { twiddles, setTwiddleForm }: Props = $props();
</script>

{#snippet twiddlesList(data: Twiddle[])}
	{#each data as twiddle (twiddle.id)}
		<TwiddleContext init={{ data: twiddle, setTwiddleForm }}>
			{#snippet children(twiddleState)}
				{#if !twiddleState.deleted}
					<TwiddleCard />
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
