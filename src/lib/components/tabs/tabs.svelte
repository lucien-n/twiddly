<script lang="ts" generics="T extends string">
	import * as Tabs from '&/ui/tabs';
	import type { TabsProps } from '.';

	// eslint-disable-next-line no-undef
	let { tabs, current = $bindable(), class: className }: TabsProps<T> = $props();
</script>

<Tabs.Root class={className} bind:value={current}>
	<Tabs.List class="w-full">
		{#each tabs as { label, href, value } (value)}
			<a {href} class="w-full">
				<Tabs.Trigger class="mx-auto w-full text-center" {value}>{label}</Tabs.Trigger>
			</a>
		{/each}
	</Tabs.List>
</Tabs.Root>
