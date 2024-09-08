<script>
	import SignupForm from './signup-form.svelte';

	const { data } = $props();
</script>

<SignupForm data={data.form} />
