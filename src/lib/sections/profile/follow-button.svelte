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
	const { APPROVED, PENDING } = FollowStatus;

	const authState = getAuthState();
	const isSelf = $derived(authState.profile.id === profile.id);
	let currentUserFollowStatus = $state(profile.currentUserFollowStatus);

	let openConfirmUnfollowDialog = $state(false);
	let followLoading = $state(false);
	const loader = async (predicate: () => Promise<void>) => {
		followLoading = true;

		await predicate();

		followLoading = false;
	};

	const handleFollow = async () => {
		if ([PENDING, APPROVED].some((status) => status === currentUserFollowStatus)) {
			return;
		}

		await loader(async () => {
			const { data, error } = await fetcher<FollowStatus>(
				route('POST /api/v1/profile/[handle]/follow', { handle: profile.handle }),
				'POST'
			);

			if (error) {
				toast.error(error);
				return;
			}

			currentUserFollowStatus = data;
		});
	};

	const handleCancelFollowRequest = async () => {
		if (currentUserFollowStatus !== PENDING) {
			return;
		}

		await loader(async () => {
			const { data, error } = await fetcher<FollowStatus>(
				route('PUT /api/v1/profile/[handle]/follow', { handle: profile.handle }),
				'PUT',
				{ body: JSON.stringify({ action: 'CANCEL' } satisfies { action: FollowAction }) }
			);

			if (error) {
				toast.error(error);
				return;
			}

			currentUserFollowStatus = data;
		});
	};

	const handleUnfollow = async () => {
		if (currentUserFollowStatus !== APPROVED) {
			return;
		}

		await loader(async () => {
			const { data, error } = await fetcher<FollowStatus>(
				route('DELETE /api/v1/profile/[handle]/follow', { handle: profile.handle }),
				'DELETE'
			);

			if (error) {
				toast.error(error);
				return;
			}

			currentUserFollowStatus = data;
		});
	};

	const handleClick = async () => {
		switch (currentUserFollowStatus) {
			case APPROVED: {
				if (profile.isPrivate) {
					openConfirmUnfollowDialog = true;
					break;
				}

				await handleUnfollow();
				break;
			}
			case PENDING: {
				await handleCancelFollowRequest();
				break;
			}
			default: {
				await handleFollow();
			}
		}
	};
</script>

{#if !isSelf}
	<LoadingButton
		variant={currentUserFollowStatus ? 'default' : 'secondary'}
		onclick={handleClick}
		loading={followLoading}
	>
		{#snippet icon()}
			{#if currentUserFollowStatus}
				<UserMinus />
			{:else}
				<UserPlus />
			{/if}
		{/snippet}

		<p>
			{#if currentUserFollowStatus === APPROVED}
				Unfollow
			{:else if currentUserFollowStatus === PENDING}
				Cancel Request
			{:else if profile.isPrivate}
				Send Request
			{:else}
				Follow
			{/if}
		</p>
	</LoadingButton>
{/if}

<ConfirmUnfollowDialog bind:open={openConfirmUnfollowDialog} onconfirm={handleUnfollow} {profile} />
