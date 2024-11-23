<script lang="ts">
	import { NonVerifiedBanner } from '#/auth';

	const { children, data } = $props();

	let bannerOpen = $state(!!data.user && !data.user?.emailVerified);
</script>

<NonVerifiedBanner bind:open={bannerOpen} />

<div class="mx-auto h-full w-full overflow-hidden sm:max-w-3xl sm:gap-4">
	{@render children()}
</div>
