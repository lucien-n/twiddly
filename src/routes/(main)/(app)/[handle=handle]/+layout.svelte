<script lang="ts">
	import { Scrollable } from '&/scrollable';
	import ProfileHeader from './profile-header.svelte';

	const { data, children } = $props();
	const profile = $derived(data.profile);

	let scroll = $state(0);
</script>

<div class="relative flex h-full w-full flex-col">
	<ProfileHeader {profile} setProfileForm={data.setProfileForm} bind:scroll />

	<Scrollable bind:scroll hideBackToTop>
		{#key profile}
			<div class="min-h-screen space-y-3">
				{@render children()}
			</div>
		{/key}
	</Scrollable>
</div>
