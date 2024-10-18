<script>
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from 'svelte-sonner';
	import { navigating } from '$app/stores';
	import '../app.css';
	import { fly } from 'svelte/transition';
	import { PageInfos } from '$lib/components/page-infos';

	const { children } = $props();
</script>

<Toaster richColors />
<ModeWatcher />
<PageInfos />

{#if $navigating}
	<div class="absolute z-[9] w-full" transition:fly={{ y: -100, duration: 100 }}>
		<div class="h-1.5 w-full overflow-hidden bg-secondary">
			<div class="progress left-right h-full w-full bg-secondary-foreground"></div>
		</div>
	</div>
{/if}

{@render children()}
