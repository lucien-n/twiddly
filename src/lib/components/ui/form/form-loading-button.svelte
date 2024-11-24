<script lang="ts">
	import { LoadingButton, type LoadingButtonProps } from '&/button';

	const { children, ...props }: LoadingButtonProps = $props();
</script>

<LoadingButton type="submit" {...props}>
	{@render children()}
</LoadingButton>
