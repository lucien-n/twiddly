<script lang="ts">
	const { children } = $props();
</script>

<div class="h-screen w-full overflow-y-hidden p-6">
	{@render children()}
</div>
