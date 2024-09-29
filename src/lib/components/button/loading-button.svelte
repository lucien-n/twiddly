<script lang="ts">
	import { Button } from '&/button';
	import { LoaderCircle } from 'lucide-svelte';
	import type { LoadingButtonProps } from '.';

	const { children, loading, disableWhileLoading = true, ...props }: LoadingButtonProps = $props();
</script>

<Button
	disabled={(disableWhileLoading && loading) || ('disabled' in props && props.disabled)}
	{...props}
>
	{#if loading}
		<LoaderCircle class="mr-2 animate-spin" />
	{/if}

	{@render children()}
</Button>
