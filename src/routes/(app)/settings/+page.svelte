<script lang="ts">
	import SetSettingsForm from "./set-settings-form.svelte";


    const {data} = $props()
</script>

<SetSettingsForm data={data.setSettingsForm} />