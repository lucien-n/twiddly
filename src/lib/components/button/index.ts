import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import LoadingButton from './loading-button.svelte';

type LoadingButtonProps = HTMLButtonAttributes & {
	children: Snippet;
	loading?: boolean;
	disableWhileLoading?: boolean;
};

export { LoadingButton, type LoadingButtonProps };
