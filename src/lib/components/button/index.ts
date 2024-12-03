import type { ButtonProps } from '&/ui/button';
import type { Snippet } from 'svelte';
import LoadingButton from './loading-button.svelte';

type LoadingButtonProps = ButtonProps & {
	children: Snippet;
	icon?: Snippet;
	loading?: boolean;
	keepEnabledWhileLoading?: boolean;
};

export { LoadingButton, type LoadingButtonProps };
