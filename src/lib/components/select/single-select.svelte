<script lang="ts" generics="T extends string">
	import * as Select from '&/ui/select';
	import type { SingleSelectProps } from '.';

	let {
		options,
		value = $bindable(),
		placeholder,
		onValueChange,
		...props
		// eslint-disable-next-line no-undef
	}: SingleSelectProps<T> = $props();

	let triggerContent = $derived(options.find((opt) => opt.value === value)?.label ?? placeholder);
</script>

<Select.Root bind:value {onValueChange} type="single" name={props?.name}>
	<Select.Trigger {...props}>{triggerContent}</Select.Trigger>
	<Select.Content>
		{#each options as { value, label, description }}
			<Select.Item {value}>
				<div>
					{label}
					{#if description}
						<p class="text-sm text-muted-foreground">{description}</p>
					{/if}
				</div>
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
