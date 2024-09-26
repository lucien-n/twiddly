<script lang="ts" generics="T extends string">
	import * as Select from '&/select';
	import type { SelectProps } from '.';

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
		{#each options as { value, label }}
			<Select.Item {value}>
				{label}
			</Select.Item>
		{/each}
	</Select.Content>
	<input hidden bind:value={selectedOption} name={attrs.name} />
</Select.Root>
