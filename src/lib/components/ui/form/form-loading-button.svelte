<script lang="ts">
	import { LoadingButton, type LoadingButtonProps } from '$lib/components/button';
	import type { HTMLAttributes } from 'svelte/elements';

	const { children, ...props }: Omit<LoadingButtonProps, keyof HTMLAttributes<HTMLAnchorElement>> =
		$props();
</script>

<LoadingButton type="submit" {...props}>
	{@render children()}
</LoadingButton>
