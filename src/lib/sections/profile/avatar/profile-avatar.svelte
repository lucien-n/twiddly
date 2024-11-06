<script lang="ts">
	import { getProfileAvatar } from '$lib/utils/avatar';
	import * as Avatar from '&/ui/avatar';
	import type { Props } from '.';
	import { avatarVariants } from './index';
	import { Lock } from 'lucide-svelte';
	import * as Tooltip from '&/ui/tooltip';
	import { getAuthState } from '#/auth';

	const { profile, size, class: className }: Props = $props();

	const authState = getAuthState();
	const src = $derived(profile ? getProfileAvatar(profile) : undefined);
</script>

<div class="relative">
	{#key src}
		<Avatar.Root
			class={avatarVariants({
				size,
				className
			})}
		>
			{#if profile}
				<Avatar.Image {src} alt="@{profile.handle}" />
				<Avatar.Fallback>{profile.handle.charAt(0).toUpperCase()}</Avatar.Fallback>
			{:else}
				<Avatar.Image alt="placeholder" />
			{/if}
		</Avatar.Root>
	{/key}

	{#if profile?.privacySettings?.private}
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
