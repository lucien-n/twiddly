<script lang="ts">
	import SetPrivacySettingsForm from '@/settings/form/set-privacy-settings-form.svelte';

	const { data } = $props();
</script>

<SetPrivacySettingsForm data={data.setSettingsForm} />
