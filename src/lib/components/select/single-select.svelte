<script lang="ts" generics="T extends string">
	import * as Select from '&/ui/select';
	import { onMount } from 'svelte';
	import type { SingleSelectProps } from '.';

	// eslint-disable-next-line no-undef
	let { options, value = $bindable(), placeholder, attrs }: SingleSelectProps<T> = $props();

	let triggerContent = $derived(options.find((opt) => opt.value === value) ?? placeholder);
</script>

<Select.Root bind:value type="single" name={attrs?.name}>
	<Select.Trigger {...attrs}>{triggerContent}</Select.Trigger>
	<Select.Content>
		{#each options as { value, label }}
			<Select.Item {value}>
				{label}
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
