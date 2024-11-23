<script lang="ts">
	import { getAuthState } from '#/auth';
	import { ProfileAvatar, SetProfileDialog } from '#/profile';
	import type { Profile } from '$lib';
	import type { SetProfileSchema } from '$lib/schemas/profile/set-profile';
	import { Dropdown } from '&/dropdown';
	import { EllipsisVertical } from 'lucide-svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { ProfileTab, Tab } from './types';
	import * as Tabs from '&/ui/tabs';

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

	const authState = getAuthState();
	const isSelf = $derived(authState.session?.userId === profile.id);
	let openEditProfileDialog = $state(false);
</script>

<header class="flex py-4">
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
</header>

<Tabs.Root class="w-full space-y-3" bind:value={currentTab}>
	<Tabs.List class="w-full">
		{#each tabs as { label, href, value } (value)}
			<a {href} class="w-full">
				<Tabs.Trigger class="mx-auto w-full text-center" {value}>{label}</Tabs.Trigger>
			</a>
		{/each}
	</Tabs.List>
</Tabs.Root>

<SetProfileDialog bind:open={openEditProfileDialog} data={setProfileForm} />
