<script lang="ts">
	import { PageInfos } from '$lib/components/page-infos';
	import { SetPrivacySettingsForm } from '@/settings';

	const { data } = $props();
</script>

<PageInfos
	title="Privacy Settings"
	description="Control everything related to your privacy on Twiddly"
/>

<SetPrivacySettingsForm data={data.setSettingsForm} />
