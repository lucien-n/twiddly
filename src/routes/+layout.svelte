<script>
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from 'svelte-sonner';
	import '../app.css';

	const { children } = $props();
</script>

<Toaster richColors />
<ModeWatcher />

{@render children()}
