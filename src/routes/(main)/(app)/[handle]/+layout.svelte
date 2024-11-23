<script lang="ts">
	import { page } from '$app/stores';
	import { route } from '$lib/ROUTES';
	import { Scrollable } from '&/scrollable';
	import MiniProfileHeader from './mini-profile-header.svelte';
	import ProfileHeader from './profile-header.svelte';
	import type { ProfileTab, Tab } from './types';

	const { data, children } = $props();
	const profile = $derived(data.profile);

	const tabs: Tab[] = $derived([
		{
			label: 'Activity',
			href: route('/[handle]/activity', { handle: profile.handle }),
			value: 'activity'
		},
		{ label: 'Liked', href: route('/[handle]/liked', { handle: profile.handle }), value: 'liked' }
	] as const);
	let currentTab: ProfileTab = $state('activity');
	let scroll = $state(0);

	$effect(() => {
		const possibleTabs: ProfileTab[] = ['activity', 'liked'];
		const currentPage = $page.url.href.split('/').pop()?.toLowerCase() as ProfileTab;

		if (!currentPage || !possibleTabs.includes(currentPage)) {
			currentTab = 'activity';
		}

		currentTab = currentPage;
	});
</script>

<div class="relative flex h-full w-full flex-col">
	<MiniProfileHeader
		{profile}
		{tabs}
		setProfileForm={data.setProfileForm}
		bind:scroll
		bind:currentTab
	/>

	<Scrollable bind:scroll>
		<ProfileHeader
			{profile}
			{tabs}
			setProfileForm={data.setProfileForm}
			bind:scroll
			bind:currentTab
		/>

		{#key profile}
			<div class="space-y-3">
				{@render children()}
			</div>
		{/key}
	</Scrollable>
</div>
