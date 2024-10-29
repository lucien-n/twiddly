import type { SVGAttributes } from 'svelte/elements';
import ProgressCircle from './progress-circle.svelte';

type ProgressCircleProps = SVGAttributes<SVGElement> & {
	progress: number;
	'bg-stroke'?: string;
};

export { ProgressCircle, type ProgressCircleProps };
