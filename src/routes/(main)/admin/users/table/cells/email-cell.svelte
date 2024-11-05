<script lang="ts">
	import { BadgeAlert, BadgeCheck } from 'lucide-svelte';
	import * as Tooltip from '&/ui/tooltip';

	interface Props {
		email: string;
		emailVerified: boolean;
	}
	const { email, emailVerified }: Props = $props();
</script>

<div class="flex items-center gap-1">
	<Tooltip.Root>
		<Tooltip.Trigger>
			{#if emailVerified}
				<BadgeCheck class="size-4" />
			{:else}
				<BadgeAlert class="size-4 text-destructive" />
			{/if}
		</Tooltip.Trigger>
		<Tooltip.Content>{emailVerified ? 'Verified' : 'Non Verified'}</Tooltip.Content>
	</Tooltip.Root>

	<Tooltip.Root>
		<Tooltip.Trigger class="flex">
			{email}
		</Tooltip.Trigger>
		<Tooltip.Content>
			{email}
		</Tooltip.Content>
	</Tooltip.Root>
</div>
