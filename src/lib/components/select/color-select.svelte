<script lang="ts" generics="T extends string">
	import { cn } from '$lib/shadcn/utils';
	import * as Tooltip from '&/ui/tooltip';
	import { CircleCheckBig } from 'lucide-svelte';
	import type { ColorSelectProps } from '.';

	// eslint-disable-next-line no-undef
	let { options, value: value = $bindable(), ...props }: ColorSelectProps<T> = $props();
</script>

<div class="grid grid-flow-col justify-between">
	{#each options as opt}
		{@const selected = opt.value === value}
		<Tooltip.Root>
			<Tooltip.Trigger
				class={cn(
					'relative h-9 w-9 rounded-md focus-visible:border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background',
					selected && 'border-2 border-primary'
				)}
				style="background-color: {opt.color};"
				onclick={() => (value = opt.value)}
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
				{opt.label}
			</Tooltip.Content>
		</Tooltip.Root>
	{/each}
</div>
<input {...props} hidden bind:value />
