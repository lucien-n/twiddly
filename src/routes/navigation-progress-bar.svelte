<script lang="ts">
	import { navigating } from '$app/stores';
	import { fly } from 'svelte/transition';
</script>

{#if $navigating}
	<div class="absolute z-[9] w-full" transition:fly={{ y: -100, duration: 100 }}>
		<div class="h-1.5 w-full overflow-hidden bg-secondary">
			<div class="progress left-right h-full w-full bg-secondary-foreground"></div>
		</div>
	</div>
{/if}
