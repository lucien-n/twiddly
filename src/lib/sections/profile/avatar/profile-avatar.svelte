<script lang="ts">
	import { getAuthState } from '#/auth';
	import * as Avatar from '&/ui/avatar';
	import * as Tooltip from '&/ui/tooltip';
	import { cn } from '&/utils';
	import { Role } from '@prisma/client';
	import { Ban, Lock } from 'lucide-svelte';
	import type { Props } from '.';
	import { avatarVariants } from './index';

	const { profile, size, class: className }: Props = $props();

	const authState = getAuthState();
</script>

<div class="relative">
	<Avatar.Root
		class={avatarVariants({
			size,
			className
		})}
	>
		{#if profile}
			<Avatar.Image src={profile.avatar} alt="@{profile.handle}" />
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
	{:else if profile?.isPrivate}
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
