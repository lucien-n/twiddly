<script lang="ts">
	import { Dropdown } from '&/dropdown';
	import { Scrollable } from '&/scrollable';
	import { Separator } from '&/ui/separator';
	import { getAuthState } from '#/auth';
	import { ProfileAvatar, SetProfileDialog } from '#/profile';
	import { TwiddleList } from '#/twiddle';
	import { EllipsisVertical } from 'lucide-svelte';

	const { data } = $props();
	const profile = $derived(data.profile);

	const authState = getAuthState();
	const isSelf = $derived(authState.session?.userId === profile.id);

	let openEditProfileDialog = $state(false);
</script>

<div class="flex h-screen max-h-screen flex-col">
	<div class="flex py-4">
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

	<Separator class="my-5" />

	{#key profile}
		<Scrollable>
			<TwiddleList twiddles={data.twiddles} />
		</Scrollable>
	{/key}
</div>

<SetProfileDialog bind:open={openEditProfileDialog} data={data.setProfileForm} />
