<script lang="ts">
	import { MaintenanceMode } from '@prisma/client';
	import * as Alert from '&/ui/alert';
	import { TriangleAlert } from 'lucide-svelte';

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
	<Alert.Root class="absolute right-2 top-2 z-10 w-fit">
		<TriangleAlert class="size-4" />
		<Alert.Title>Maintenance</Alert.Title>
		<Alert.Description>
			Twiddly is under restricted access and only accessible to {accessibleTo}
		</Alert.Description>
	</Alert.Root>
{/if}
