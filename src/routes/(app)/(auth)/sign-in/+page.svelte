<script lang="ts">
	import { SignInForm } from '@/auth';

	const { data } = $props();
</script>

<SignInForm data={data.signInForm} />
