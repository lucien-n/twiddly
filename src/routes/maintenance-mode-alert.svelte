<script lang="ts">
	import { MaintenanceMode } from '@prisma/client';
	import * as HoverCard from '&/ui/hover-card';
	import { TriangleAlert, MessageCircleQuestion } from 'lucide-svelte';
	import { Button, buttonVariants } from '&/ui/button';

	interface Props {
		maintenanceMode: MaintenanceMode | undefined;
	}
	const { maintenanceMode }: Props = $props();

	const accessibleTo = $derived.by(() => {
		switch (maintenanceMode) {
			case MaintenanceMode.ADMIN:
				return 'admins';
			case MaintenanceMode.VERIFIED:
				return 'verified users';
			case MaintenanceMode.LOCKED:
				return 'no one';
		}
	});
</script>

{#if maintenanceMode && maintenanceMode !== MaintenanceMode.OPEN}
	<HoverCard.Root onOpenChange={console.log}>
		<HoverCard.Trigger
			class={buttonVariants({
				size: 'icon',
				variant: 'secondary',
				class: 'absolute right-2 top-2 z-50'
			})}
		>
			<TriangleAlert />
		</HoverCard.Trigger>
		<HoverCard.Content>
			<p class="mb-1 font-medium leading-none tracking-tight">Maintenance</p>
			<p class="text-sm [&_p]:leading-relaxed">
				Twiddly is under restricted access and only accessible to {accessibleTo}
			</p>
		</HoverCard.Content>
	</HoverCard.Root>
{/if}
