<script lang="ts" generics="T extends string">
	import { cn } from '$lib/shadcn/utils';
	import * as Tooltip from '&/tooltip';
	import { CircleCheckBig } from 'lucide-svelte';
	import type { ColorSelectProps } from '.';

	// eslint-disable-next-line no-undef
	let { options, selectedOption = $bindable(), attrs }: ColorSelectProps<T> = $props();
</script>

<div class="grid grid-flow-col justify-between">
	{#each options as { label, value, color }}
		{@const selected = selectedOption === value}
		<Tooltip.Root>
			<Tooltip.Trigger
				class={cn(
					'relative h-9 w-9 rounded-md focus-visible:border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background',
					selected && 'border-2 border-primary'
				)}
				style="background-color: {color};"
				onclick={() => (selectedOption = value)}
			>
				{#if selected}
					<CircleCheckBig
						class="absolute -right-2 -top-2 rounded-full bg-foreground p-[1px]"
						size={16}
						color="background"
					/>
				{/if}
			</Tooltip.Trigger>
			<Tooltip.Content>
				{label}
			</Tooltip.Content>
		</Tooltip.Root>
	{/each}
</div>
<input hidden bind:value={selectedOption} name={attrs.name} />
