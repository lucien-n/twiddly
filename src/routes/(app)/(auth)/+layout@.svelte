<script lang="ts">
	import { PageInfos } from '$lib/components/page-infos';

	const { children } = $props();
</script>

<PageInfos
	title="Authenticate"
	description="Sign in or up on Twiddly to interact with others and share your twiddles"
/>

{@render children()}
