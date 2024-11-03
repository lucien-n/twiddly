<script lang="ts">
	import { PageInfos } from '&/page-infos';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from 'svelte-sonner';
	import '../app.css';
	import MaintenanceModeAlert from './maintenance-mode-alert.svelte';
	import NavigationProgressBar from './navigation-progress-bar.svelte';

	const { data, children } = $props();
</script>

<NavigationProgressBar />
<MaintenanceModeAlert maintenanceMode={data.maintenanceMode} />
<Toaster richColors />
<ModeWatcher />
<PageInfos />

{@render children()}
