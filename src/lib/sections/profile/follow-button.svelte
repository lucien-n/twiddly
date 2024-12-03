<script lang="ts">
	import { getAuthState } from '#/auth';
	import type { Profile } from '$lib/models';
	import { route } from '$lib/ROUTES';
	import { LoadingButton } from '&/ui/form';
	import { UserMinus, UserPlus } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import ConfirmUnfollowDialog from './dialog/confirm-unfollow-dialog.svelte';

	interface Props {
		profile: Profile;
	}
	const { profile }: Props = $props();

	const authState = getAuthState();
	const isSelf = $derived(authState.profile.id === profile.id);

	let openConfirmUnfollowDialog = $state(false);
	let isFollowedByCurrentUser = $state(profile.isFollowedByCurrentUser);
	const handleClick = () => {
		if (isFollowedByCurrentUser && profile.isPrivate) {
			openConfirmUnfollowDialog = true;
			return;
		}

		handleFollowToggle();
	};

	let followLoading = $state(false);
	const handleFollowToggle = async () => {
		if (followLoading) {
			toast.warning('Please wait');
			return;
		}
		followLoading = true;

		try {
			const method = isFollowedByCurrentUser ? 'DELETE' : 'POST';
			const res = await fetch(
				route(`${method} /api/v1/profile/[handle]/follow`, { handle: profile.handle }),
				{ method }
			);

			if (res.ok) {
				isFollowedByCurrentUser = method === 'POST' ? true : false;
			}
		} catch (e) {
			console.error(e);
			toast.error('An error occured');
		}

		followLoading = false;
	};
</script>

{#if !isSelf}
	<LoadingButton
		variant={isFollowedByCurrentUser ? 'default' : 'secondary'}
		onclick={handleClick}
		loading={followLoading}
		keepEnabledWhileLoading
	>
		{#snippet icon()}
			{#if isFollowedByCurrentUser}
				<UserMinus />
			{:else}
				<UserPlus />
			{/if}
		{/snippet}

		<p>{isFollowedByCurrentUser ? 'Unfollow' : 'Follow'}</p>
	</LoadingButton>
{/if}

<ConfirmUnfollowDialog
	bind:open={openConfirmUnfollowDialog}
	{profile}
	onconfirm={handleFollowToggle}
/>
