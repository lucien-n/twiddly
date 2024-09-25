<script lang="ts">
	import * as Dropdown from '&/dropdown-menu';
	import type { DropdownProps } from '.';

	let { children, items, class: className }: DropdownProps = $props();
</script>

<Dropdown.Root>
	<Dropdown.Trigger class={className}>
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
