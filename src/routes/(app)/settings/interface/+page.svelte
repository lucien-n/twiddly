<script lang="ts">
	import { PageInfos } from '$lib/components/page-infos';
	import { SetInterfaceSettingsForm } from '@/settings';

	const { data } = $props();
</script>

<PageInfos title="Inferface Settings" description="Customize how Twiddly is presented to you" />

<SetInterfaceSettingsForm data={data.setSettingsForm} />
