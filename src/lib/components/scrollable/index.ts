import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

type ScrollableProps = HTMLAttributes<HTMLDivElement> & {
	scroll?: number;
	children: Snippet;
	hideBackToTop?: boolean;
};

import Scrollable from './scrollable.svelte';

export { Scrollable, type ScrollableProps };
