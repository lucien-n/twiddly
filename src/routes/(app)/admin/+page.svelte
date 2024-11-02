<script lang="ts">
	import SetSiteSettingsForm from './set-site-settings-form.svelte';

	const { data } = $props();
</script>

<SetSiteSettingsForm setSiteSettingsForm={data.setSiteSettingsForm} />
