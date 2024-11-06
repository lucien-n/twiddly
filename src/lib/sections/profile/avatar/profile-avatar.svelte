<script lang="ts">
	import { getProfileAvatar } from '$lib/utils/avatar';
	import * as Avatar from '&/ui/avatar';
	import type { Props } from '.';
	import { avatarVariants } from './index';
	import { Ban, Lock } from 'lucide-svelte';
	import * as Tooltip from '&/ui/tooltip';
	import { getAuthState } from '#/auth';
	import { Role } from '@prisma/client';
	import { cn } from '&/utils';

	const { profile, size, class: className }: Props = $props();

	const authState = getAuthState();
	const src = $derived(profile ? getProfileAvatar(profile) : undefined);
</script>

<div class="relative">
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

	{#if profile?.role === Role.RESTRICTED}
		<Tooltip.Root>
			<Tooltip.Trigger
				class={cn(
					'absolute rounded-full border bg-background',
					size === 'lg' ? 'bottom-2 right-2' : '-bottom-1 -right-1'
				)}
			>
				<Ban class={cn(size === 'lg' ? 'size-8 p-2' : 'size-5 p-1')} />
			</Tooltip.Trigger>
			<Tooltip.Content>
				{profile.id === authState.user?.id ? 'Your' : `${profile.displayName}'s`} profile is restricted
			</Tooltip.Content>
		</Tooltip.Root>
	{:else if profile?.privacySettings?.private}
		<Tooltip.Root>
			<Tooltip.Trigger
				class={cn(
					'absolute rounded-full border bg-background',
					size === 'lg' ? 'bottom-2 right-2' : '-bottom-1 -right-1'
				)}
			>
				<Lock class={cn(size === 'lg' ? 'size-8 p-2' : 'size-5 p-1')} />
			</Tooltip.Trigger>
			<Tooltip.Content>
				{profile.id === authState.user?.id ? 'Your' : `${profile.displayName}'s`} profile is private
			</Tooltip.Content>
		</Tooltip.Root>
	{/if}
</div>
