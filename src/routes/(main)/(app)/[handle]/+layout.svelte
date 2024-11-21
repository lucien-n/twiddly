<script lang="ts">
	import { getAuthState } from '#/auth';
	import { ProfileAvatar, SetProfileDialog } from '#/profile';
	import { Dropdown } from '&/dropdown';
	import { Separator } from '&/ui/separator';
	import { EllipsisVertical } from 'lucide-svelte';
	import * as Tabs from '&/ui/tabs';
	import { route } from '$lib/ROUTES';

	const { data, children } = $props();
	const profile = $derived(data.profile);

	const authState = getAuthState();
	const isSelf = $derived(authState.session?.userId === profile.id);

	const tabs = $derived([
		{
			label: 'Activity',
			href: route('/[handle]/activity', { handle: profile.handle }),
			value: 'activity'
		},
		{ label: 'Liked', href: route('/[handle]/liked', { handle: profile.handle }), value: 'liked' }
	] as const);
	const currentTab: (typeof tabs)[number]['value'] = 'activity';

	let openEditProfileDialog = $state(false);
</script>

<div class="flex h-screen max-h-screen flex-col">
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

	<Separator class="my-5" />

	{#key profile}
		<Tabs.Root>
			<Tabs.List class="w-full">
				{#each tabs as { label, href, value } (value)}
					<a {href}>
						<Tabs.Trigger class="mx-auto w-full text-center" {value}>{label}</Tabs.Trigger>
					</a>
				{/each}
			</Tabs.List>
			<Tabs.Content value={currentTab}>
				{@render children()}
			</Tabs.Content>
		</Tabs.Root>
	{/key}
</div>

<SetProfileDialog bind:open={openEditProfileDialog} data={data.setProfileForm} />
