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

	interface Props {
		profile: Profile;
		setProfileForm: SuperValidated<Infer<SetProfileSchema>>;
		tabs: Tab[];
		currentTab: ProfileTab;
		scroll: number;
	}
	let {
		profile,
		setProfileForm,
		tabs,
		currentTab = $bindable(),
		scroll = $bindable()
	}: Props = $props();

	const isShown = $derived(scroll === -1 || scroll > 175);
	const authState = getAuthState();
	const isSelf = $derived(authState.session?.userId === profile.id);
	let openEditProfileDialog = $state(false);
</script>

{#if isShown}
	<header
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
	</header>
{/if}

<SetProfileDialog bind:open={openEditProfileDialog} data={setProfileForm} />
