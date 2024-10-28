import type { Button as ButtonPrimitive } from 'bits-ui';
import type { Snippet } from 'svelte';
import LoadingButton from './loading-button.svelte';

type LoadingButtonProps = ButtonPrimitive.RootProps & {
	children: Snippet;
	loading?: boolean;
	disableWhileLoading?: boolean;
};

export { LoadingButton, type LoadingButtonProps };
