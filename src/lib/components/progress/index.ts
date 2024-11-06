import type { SVGAttributes } from 'svelte/elements';
import ProgressCircle from './progress-circle.svelte';
import TooltippedProgressCircle from './tooltipped-progress-circle.svelte';

type ProgressCircleProps = SVGAttributes<SVGElement> & {
	progress: number;
	'bg-stroke'?: string;
};

type TooltippedProgressCircleProps = Omit<ProgressCircleProps, 'progress'> & {
	current: number;
	max: number;
};

export {
	ProgressCircle,
	TooltippedProgressCircle,
	type ProgressCircleProps,
	type TooltippedProgressCircleProps
};
