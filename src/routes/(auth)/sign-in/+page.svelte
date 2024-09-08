<script lang="ts">
	import SigninForm from './signin-form.svelte';

	const { data } = $props();
</script>

<SigninForm data={data.form} />
