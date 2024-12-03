<script lang="ts">
	import { Button } from '&/ui/button';
	import { LoaderCircle } from 'lucide-svelte';
	import type { LoadingButtonProps } from '.';

	const { children, icon, loading, keepEnabledWhileLoading, ...props }: LoadingButtonProps =
		$props();

	const disabled = $derived(
		!!(keepEnabledWhileLoading ? 'disabled' in props && props.disabled : loading)
	);
</script>

<Button {...props} {disabled}>
	<div class="mr-1">
		{#if loading}
			<LoaderCircle class="animate-spin" />
		{:else if icon}
			{@render icon()}
		{/if}
	</div>

	{@render children()}
</Button>
