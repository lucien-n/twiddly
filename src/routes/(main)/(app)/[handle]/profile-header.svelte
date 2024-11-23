<script lang="ts">
	import { getAuthState } from '#/auth';
	import { ProfileAvatar, SetProfileDialog } from '#/profile';
	import { page } from '$app/stores';
	import type { Profile } from '$lib';
	import { route } from '$lib/ROUTES';
	import type { SetProfileSchema } from '$lib/schemas/profile/set-profile';
	import { Dropdown } from '&/dropdown';
	import * as Tabs from '&/ui/tabs';
	import * as Tooltip from '&/ui/tooltip';
	import { cn } from '&/utils';
	import { ArrowUp, EllipsisVertical } from 'lucide-svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { ProfileTab, Tab } from './types';

	interface Props {
		profile: Profile;
		setProfileForm: SuperValidated<Infer<SetProfileSchema>>;
		scroll: number;
	}
	let { profile, setProfileForm, scroll = $bindable() }: Props = $props();

	let openEditProfileDialog = $state(false);

	const authState = getAuthState();

	const isSelf = $derived(authState.session?.userId === profile.id);
	const isMini = $derived(scroll === -1 || scroll > 0);

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

<header class="flex w-full flex-col py-4">
	<div class="flex w-full gap-3">
		<ProfileAvatar
			{profile}
			size={isMini ? 'default' : 'lg'}
			class="transition-all duration-150 ease-in-out"
		/>
		<div
			class={cn(
				'flex transition-all duration-200 ease-in-out',
				isMini ? 'items-center gap-3' : 'flex-col gap-1 pl-5 pt-6'
			)}
		>
			<h1 class={cn(isMini ? 'mb-[.1rem] text-xl' : 'text-4xl')}>{profile.displayName}</h1>
			<p class="text-muted-foreground">@{profile.handle}</p>
			{#if !isMini}
				<div class="mt-2 text-base">
					{#each profile.bio.split('\n') as line}
						<p>{line}</p>
					{/each}
				</div>
			{/if}
		</div>

		<div class="ml-auto flex gap-3">
			{#if isMini}
				<Tooltip.Root>
					<Tooltip.Trigger onclick={() => (scroll = -1)}>
						<ArrowUp />
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Back to top</p>
					</Tooltip.Content>
				</Tooltip.Root>
			{/if}

			{#if isSelf}
				<Dropdown items={[{ item: 'Edit', onclick: () => (openEditProfileDialog = true) }]}>
					<EllipsisVertical />
				</Dropdown>
			{/if}
		</div>
	</div>

	<Tabs.Root
		class={cn('w-full transition-all duration-200 ease-in-out', isMini ? 'mt-2' : 'mt-8')}
		bind:value={currentTab}
	>
		<Tabs.List class="w-full">
			{#each tabs as { label, href, value } (value)}
				<a {href} class="w-full">
					<Tabs.Trigger class="mx-auto w-full text-center" {value}>{label}</Tabs.Trigger>
				</a>
			{/each}
		</Tabs.List>
	</Tabs.Root>
</header>

<SetProfileDialog bind:open={openEditProfileDialog} data={setProfileForm} />
