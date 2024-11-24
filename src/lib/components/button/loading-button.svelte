<script lang="ts">
	import { Button } from '&/ui/button';
	import { LoaderCircle } from 'lucide-svelte';
	import type { LoadingButtonProps } from '.';

	const { children, loading, disableWhileLoading = true, ...props }: LoadingButtonProps = $props();
	const disabled = $derived(
		!!(disableWhileLoading ? loading : 'disabled' in props && props.disabled)
	);
</script>

<Button {...props} {disabled}>
	{#if loading}
		<LoaderCircle class="mr-2 animate-spin" />
	{/if}

	{@render children()}
</Button>
