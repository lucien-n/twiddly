<script lang="ts">
	import { getAuthState } from '#/auth';
	import { ProfileAvatar, SetProfileDialog } from '#/profile';
	import type { Profile } from '$lib';
	import type { SetProfileSchema } from '$lib/schemas/profile/set-profile';
	import { Dropdown } from '&/dropdown';
	import * as Tabs from '&/ui/tabs';
	import * as Tooltip from '&/ui/tooltip';
	import { ArrowUp, EllipsisVertical } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { ProfileTab, Tab } from './types';
	import { route } from '$lib/ROUTES';
	import { page } from '$app/stores';

	interface Props {
		profile: Profile;
		setProfileForm: SuperValidated<Infer<SetProfileSchema>>;
		scroll: number;
	}
	let { profile, setProfileForm, scroll = $bindable() }: Props = $props();

	let openEditProfileDialog = $state(false);

	const authState = getAuthState();

	const isSelf = $derived(authState.session?.userId === profile.id);
	const isMini = $derived(scroll === -1 || scroll > 200);

	const tabs: Tab[] = $derived([
		{
			label: 'Activity',
			href: route('/[handle]/activity', { handle: profile.handle }),
			value: 'activity'
		},
		{ label: 'Liked', href: route('/[handle]/liked', { handle: profile.handle }), value: 'liked' }
	] as const);
	let currentTab: ProfileTab = $state('activity');

	$effect(() => {
		const possibleTabs: ProfileTab[] = ['activity', 'liked'];
		const currentPage = $page.url.href.split('/').pop()?.toLowerCase() as ProfileTab;

		if (!currentPage || !possibleTabs.includes(currentPage)) {
			currentTab = 'activity';
		}

		currentTab = currentPage;
	});
</script>

<header class="flex flex-col py-4">
	{#if isMini}
		<div
			transition:slide
			class="absolute z-[1] flex h-20 w-full items-center justify-between bg-background px-5"
		>
			<div class="flex items-center gap-3">
				<ProfileAvatar {profile} />
				<h1 class="mb-[.1rem] text-xl">{profile.displayName}</h1>
				<p class="text-muted-foreground">@{profile.handle}</p>
			</div>
			<div class="flex w-full">
				<Tabs.Root value={currentTab} class="mx-auto">
					<Tabs.List>
						{#each tabs as { label, href, value } (value)}
							<a
								{href}
								onclick={() => {
									currentTab = value;
									scroll = 0;
								}}
							>
								<Tabs.Trigger class="mx-auto w-full px-5 text-center" {value}>{label}</Tabs.Trigger>
							</a>
						{/each}
					</Tabs.List>
				</Tabs.Root>

				<div class="flex gap-3">
					<Tooltip.Root>
						<Tooltip.Trigger onclick={() => (scroll = -1)}>
							<ArrowUp />
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>Back to top</p>
						</Tooltip.Content>
					</Tooltip.Root>

					{#if isSelf}
						<Dropdown items={[{ item: 'Edit', onclick: () => (openEditProfileDialog = true) }]}>
							<EllipsisVertical />
						</Dropdown>
					{/if}
				</div>
			</div>
		</div>
	{:else}
		<div class="flex flex-row">
			<ProfileAvatar {profile} size="lg" />
			<div class="flex flex-col gap-1 pl-5 pt-6">
				<h1 class="text-4xl">{profile.displayName}</h1>
				<p class="text-muted-foreground">@{profile.handle}</p>
				<div class="mt-2 text-base">
					{#each profile.bio.split('\n') as line}
						<p>{line}</p>
					{/each}
				</div>
			</div>

			{#if isSelf}
				<Dropdown
					items={[{ item: 'Edit', onclick: () => (openEditProfileDialog = true) }]}
					class="ml-auto h-fit p-5"
				>
					<EllipsisVertical />
				</Dropdown>
			{/if}
		</div>

		<Tabs.Root class="mt-8 w-full" bind:value={currentTab}>
			<Tabs.List class="w-full">
				{#each tabs as { label, href, value } (value)}
					<a {href} class="w-full">
						<Tabs.Trigger class="mx-auto w-full text-center" {value}>{label}</Tabs.Trigger>
					</a>
				{/each}
			</Tabs.List>
		</Tabs.Root>
	{/if}
</header>

<SetProfileDialog bind:open={openEditProfileDialog} data={setProfileForm} />
