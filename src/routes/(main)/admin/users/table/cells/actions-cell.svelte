<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { Button } from '&/ui/button';
	import * as DropdownMenu from '&/ui/dropdown-menu';
	import { Ellipsis, ExternalLink, Ban } from 'lucide-svelte';
	import type { DataUser } from '../../types';
	import { Role } from '@prisma/client';
	import { dev } from '$app/environment';
	import { toast } from 'svelte-sonner';
	import { invalidate } from '$app/navigation';

	const { id, handle, role }: DataUser = $props();

	const handleRestrict = async () => {
		try {
			const res = await fetch(route('GET /api/v1/admin/users/[id]/restrict', { id }));

			if (!res.ok) {
				toast.warning('Please try again later');
				return;
			}

			toast.success(`@${handle} is now restricted`);
			await invalidate('admin:users');
		} catch (e) {
			if (dev) {
				console.error(e);
			}

			toast.error('An unexpected error occured');
		}
	};

	const handleUnrestrict = async () => {
		try {
			const res = await fetch(route('GET /api/v1/admin/users/[id]/unrestrict', { id }));

			if (!res.ok) {
				toast.warning('Please try again later');
				return;
			}

			toast.success(`@${handle} is now unrestricted`);
			await invalidate('admin:users');
		} catch (e) {
			if (dev) {
				console.error(e);
			}

			toast.error('An unexpected error occured');
		}
	};
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
			<DropdownMenu.Item>
				<ExternalLink />
				<p>View profile</p>
			</DropdownMenu.Item>
		</a>
		{#if role === Role.RESTRICTED}
			<DropdownMenu.Item onclick={handleUnrestrict}>
				<p>Unrestrict</p>
			</DropdownMenu.Item>
		{:else if role === Role.USER}
			<DropdownMenu.Item onclick={handleRestrict}>
				<Ban class="size-4" />
				<p>Restrict</p>
			</DropdownMenu.Item>
		{/if}
	</DropdownMenu.Content>
</DropdownMenu.Root>
