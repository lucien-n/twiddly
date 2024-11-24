<script lang="ts">
	import { navigating } from '$app/stores';
	import { fly } from 'svelte/transition';
</script>

{#if $navigating}
	<div class="absolute z-[9] w-full" transition:fly={{ y: -100, duration: 100 }}>
		<div class="h-1.5 w-full overflow-hidden bg-secondary">
			<div class="progress left-right h-full w-full bg-primary"></div>
		</div>
	</div>
{/if}

<style>
	.progress {
		animation: indeterminateAnimation 1s infinite linear;
		transform-origin: 0% 50%;
	}

	@keyframes indeterminateAnimation {
		0% {
			transform: translateX(0) scaleX(0);
		}
		40% {
			transform: translateX(0) scaleX(0.4);
		}
		100% {
			transform: translateX(100%) scaleX(0.5);
		}
	}
</style>
