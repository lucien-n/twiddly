<script lang="ts">
	import { NavigationProgressBar } from '#/nav';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from 'svelte-sonner';
	import '../app.css';
	import { MaintenanceModeAlert, PageInfos } from '#/application';

	const { data, children } = $props();
</script>

<MaintenanceModeAlert maintenanceMode={data.maintenanceMode} />
<NavigationProgressBar />
<Toaster richColors />
<ModeWatcher />
<PageInfos />

{@render children()}
