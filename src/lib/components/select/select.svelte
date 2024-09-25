<script lang="ts" generics="T extends string">
	import { cn } from '$lib/shadcn/utils';
	import * as Select from '&/select';
	import type { SelectProps } from '.';
	import * as Tooltip from '&/tooltip';

	// eslint-disable-next-line no-undef
	let { options, selectedOption = $bindable(), attrs }: SelectProps<T> = $props();
</script>

<Select.Root
	selected={options.find((opt) => opt.value === selectedOption)}
	onSelectedChange={(v) => {
		if (!v) return;
		selectedOption = v.value;
	}}
>
	<Select.Trigger {...attrs}>
		<Select.Value placeholder="Theme" />
	</Select.Trigger>
	<Select.Content>
		{#each options as { value, label, color }}
			<Select.Item {value}>
				{label}
				{#if color}
					<Tooltip.Root>
						<Tooltip.Trigger
							class={cn('ml-auto h-7 w-7 rounded-md')}
							style="background-color: {color};"
						/>
						<Tooltip.Content side="left">
							{color}
						</Tooltip.Content>
					</Tooltip.Root>
				{/if}
			</Select.Item>
		{/each}
	</Select.Content>
	<input hidden bind:value={selectedOption} name={attrs.name} />
</Select.Root>
