<script lang="ts">
	import { calculatePercentage } from '$lib/utils/helpers';
	import * as Tooltip from '&/ui/tooltip';
	import type { TooltippedProgressCircleProps } from '.';
	import ProgressCircle from './progress-circle.svelte';

	const { current, max, ...props }: TooltippedProgressCircleProps = $props();
	const progress = $derived(calculatePercentage(current, max));
</script>

<Tooltip.Root>
	<Tooltip.Trigger class="size-7 self-center">
		<ProgressCircle
			{...props}
			{progress}
			stroke-width={3}
			bg-stroke={props['bg-stroke'] ?? 'hsl(0 0% 3.9%)'}
			stroke="hsl(0 0% 98%)"
		/>
	</Tooltip.Trigger>
	<Tooltip.Content>
		{current} / {max}
	</Tooltip.Content>
</Tooltip.Root>
