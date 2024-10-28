<script lang="ts">
	import * as Dropdown from '&/ui/dropdown-menu';
	import type { DropdownProps } from '.';

	let { children, items, class: className, stopPropagation }: DropdownProps = $props();

	const handleClick = (event: MouseEvent) => {
		if (stopPropagation) event.stopPropagation();
	};
</script>

<Dropdown.Root>
	<Dropdown.Trigger class={className} onclick={handleClick}>
		{@render children()}
	</Dropdown.Trigger>
	<Dropdown.Content>
		{#each items as { item, onclick }}
			<Dropdown.Item {onclick}>
				{#if typeof item === 'string'}
					{item}
				{:else}
					{@render item()}
				{/if}
			</Dropdown.Item>
		{/each}
	</Dropdown.Content>
</Dropdown.Root>
