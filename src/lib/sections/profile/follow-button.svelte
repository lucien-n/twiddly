<script lang="ts">
	import { getAuthState } from '#/auth';
	import type { Profile } from '$lib/models';
	import { route } from '$lib/ROUTES';
	import type { FollowAction } from '$lib/schemas/follow/update-request';
	import { fetcher } from '$lib/utils/fetcher';
	import { LoadingButton } from '&/ui/form';
	import { FollowStatus } from '@prisma/client';
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
	let followStatus = $state(profile.followStatus);
	let isFollowedByCurrentUser = $derived(followStatus === FollowStatus.APPROVED);
	const handleClick = () => {
		if (!isFollowedByCurrentUser && profile.isPrivate) {
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

		const getRequest = (): {
			method: 'POST' | 'DELETE';
			body?: { action: FollowAction };
		} => {
			switch (followStatus) {
				case FollowStatus.APPROVED:
					return { method: 'DELETE' };
				default:
					return { method: 'POST' };
			}
		};

		const { method, body } = getRequest();
		const { data, error } = await fetcher<FollowStatus>(
			route(`${method} /api/v1/profile/[handle]/follow`, { handle: profile.handle }),
			method,
			{ body: body ? JSON.stringify(body) : undefined }
		);

		if (error) {
			toast.error(error);
		}

		if (data) {
			followStatus = data;
		}

		openConfirmUnfollowDialog = false;
		followLoading = false;
	};
</script>

{#if !isSelf}
	<LoadingButton
		variant={followStatus ? 'default' : 'secondary'}
		onclick={handleClick}
		loading={followLoading}
		keepEnabledWhileLoading
	>
		{#snippet icon()}
			{#if followStatus}
				<UserMinus />
			{:else}
				<UserPlus />
			{/if}
		{/snippet}

		<p>
			{#if followStatus === FollowStatus.APPROVED}
				Unfollow
			{:else if followStatus === FollowStatus.PENDING}
				Cancel Request
			{:else if profile.isPrivate}
				Send Request
			{:else}
				Follow
			{/if}
		</p>
	</LoadingButton>
{/if}

<ConfirmUnfollowDialog
	bind:open={openConfirmUnfollowDialog}
	onconfirm={handleFollowToggle}
	{profile}
/>
