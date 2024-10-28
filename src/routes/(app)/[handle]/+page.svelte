<script lang="ts">
	import { Dropdown } from '&/dropdown';
	import { Scrollable } from '&/scrollable';
	import { Separator } from '&/ui/separator';
	import * as Tooltip from '&/ui/tooltip';
	import { getAuthState } from '@/auth';
	import { ProfileAvatar, SetProfileDialog } from '@/profile';
	import { TwiddleList } from '@/twiddle';
	import { EllipsisVertical, Lock } from 'lucide-svelte';

	const { data } = $props();
	const profile = $derived(data.profile);

	const authState = getAuthState();
	const isSelf = $derived(authState.session?.userId === profile.id);

	let openEditProfileDialog: boolean = $state(false);
</script>

<div class="flex h-screen max-h-screen flex-col">
	<div class="flex py-4">
		<div class="relative">
			<ProfileAvatar {profile} size="lg" />
			{#if profile.privacySettings?.private}
				<Tooltip.Root>
					<Tooltip.Trigger class="absolute bottom-2 right-2 rounded-full border bg-background">
						<Lock class="h-8 w-8 p-2" />
					</Tooltip.Trigger>
					<Tooltip.Content>
						{profile.id === authState.user?.id ? 'Your' : `${profile.displayName}'s`} profile is private
					</Tooltip.Content>
				</Tooltip.Root>
			{/if}
		</div>
		<div class="flex flex-col gap-1 py-6 pl-5">
			<h1 class="text-4xl">{profile.displayName}</h1>
			<p class="text-muted-foreground">@{profile.handle}</p>
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

	<Scrollable>
		<TwiddleList twiddles={data.twiddles} setTwiddleForm={data.setTwiddleForm} />
	</Scrollable>
</div>

<SetProfileDialog bind:open={openEditProfileDialog} data={data.setProfileForm} />
