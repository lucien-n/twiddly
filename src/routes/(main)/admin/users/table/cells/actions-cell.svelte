<script lang="ts">
	import { Ellipsis } from 'lucide-svelte';
	import { Button } from '&/ui/button';
	import * as DropdownMenu from '&/ui/dropdown-menu';
	import { route } from '$lib/ROUTES';

	interface Props {
		id: string;
		handle: string;
	}
	const { id, handle }: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
				<span class="sr-only">Open menu</span>
				<Ellipsis class="size-4" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
			<DropdownMenu.Item onclick={() => navigator.clipboard.writeText(id)}>
				Copy user ID
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<a href={route('/[handle]', { handle })}>
			<DropdownMenu.Item>View profile</DropdownMenu.Item>
		</a>
	</DropdownMenu.Content>
</DropdownMenu.Root>
