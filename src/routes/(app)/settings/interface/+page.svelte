<script lang="ts">
	import SetInterfaceSettingsForm from '@/settings/form/set-interface-settings-form.svelte';

	const { data } = $props();
</script>

<SetInterfaceSettingsForm data={data.setSettingsForm} />
