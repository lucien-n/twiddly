<script lang="ts">
	import type { ProgressCircleProps } from '.';

	const { progress, ...props }: ProgressCircleProps = $props();
</script>

<svg width="100%" height="100%" fill="none">
	<circle
		cx="50%"
		cy="50%"
		r="calc(50% - 2px)"
		stroke-width={props['stroke-width'] ?? 4}
		class="stroke-secondary"
	/>
	<circle
		cx="50%"
		cy="50%"
		r="calc(50% - 2px)"
		stroke-width={props['stroke-width'] ?? 4}
		stroke={props.stroke ?? 'blue'}
		pathLength={100}
		stroke-dasharray={100}
		stroke-dashoffset={100 - progress}
		stroke-linecap="round"
		transform="rotate(-90)"
		transform-origin="center"
		class="stroke-primary"
	/>
</svg>
