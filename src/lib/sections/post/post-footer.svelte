<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { isLiked } from '$lib/utils/post';
	import { Button, buttonVariants } from '&/button';
	import { getAuthState } from '@/auth/auth-state.svelte';
	import type { Post, Profile, Like } from '@prisma/client';
	import { Loader, Heart, MessageCircle, Repeat2, Share2, EllipsisVertical } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import * as Dropdown from '&/dropdown-menu';
	import * as AlertDialog from '&/alert-dialog';

	interface Props {
		post: Pick<Post, 'id' | 'likeCount'> & {
			author: Pick<Profile, 'id' | 'handle'>;
		} & {
			likes: Pick<Like, 'profileId'>[];
		};
	}
	let { post }: Props = $props();

	const authState = getAuthState();

	let comments = $state(0);
	const handleComment = async (event: Event) => {
		event.stopPropagation();

		comments++;
	};

	let reposts = $state(0);
	let reposted = $state(false);
	const handleRepost = async (event: Event) => {
		event.stopPropagation();

		reposted = !reposted;
		reposts += reposted ? 1 : -1;
	};

	let likes: number = $state(post.likeCount);
	let liked: boolean = $state(isLiked(authState.user?.id, post.likes));
	const handleLike = async (event: Event) => {
		event.stopPropagation();

		const url = liked
			? route('POST /api/v1/post/[id]/unlike', { id: post.id })
			: route('POST /api/v1/post/[id]/like', { id: post.id });
		const res = await fetch(url, {
			method: 'POST'
		});
		if (!res.ok) {
			liked = !liked;
			return;
		}

		try {
			const { data } = await res.json();
			const newLikeCount = parseInt(data);
			if (isNaN(newLikeCount)) return;

			likes = newLikeCount;
			liked = !liked;
		} catch {
			toast.error('An error occured');
		}
	};

	const handleShare = async (event: Event) => {
		event.stopPropagation();
	};

	let deleted: boolean = $state(false);
	let deleting: boolean = $state(false);
	let openDeleteDialog = $state(false);
	const handleDelete = async (event: Event) => {
		event.stopPropagation();
		deleting = true;

		await new Promise((r) => setTimeout(r, 3000));

		const url = route('POST /api/v1/post/[id]/delete', { id: post.id });
		const res = await fetch(url, { method: 'POST' });
		if (!res.ok) {
			toast.error('An error occured');
			return;
		}

		try {
			const { data } = await res.json();
			deleted = Boolean(data);

			if (deleted) toast.success('Success !');
		} catch {
			toast.error('An error occured');
		}

		deleting = false;
		openDeleteDialog = false;
	};
</script>

<div class="flex sm:space-x-5">
	<Button
		variant="ghost"
		size="sm"
		class="flex items-center space-x-2 transition-colors duration-200 hover:text-blue-500"
		onclick={handleComment}
	>
		<MessageCircle class="h-4 w-4" />
		<span>{comments}</span>
	</Button>
	<Button
		variant="ghost"
		size="sm"
		class={`flex items-center space-x-2 transition-colors duration-200 ${
			reposted ? 'text-green-500' : 'hover:text-green-500'
		}`}
		onclick={handleRepost}
	>
		<Repeat2 class="h-4 w-4" />
		<span>{reposts}</span>
	</Button>
	<Button
		variant="ghost"
		size="sm"
		class={`flex items-center space-x-2 transition-colors duration-200 ${
			liked ? 'text-red-500' : 'hover:text-red-500'
		}`}
		onclick={handleLike}
	>
		<Heart class={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
		<span>{likes}</span>
	</Button>
</div>

<div class="flex sm:space-x-5">
	<Button
		variant="ghost"
		size="sm"
		class="flex items-center space-x-2 transition-colors duration-200 hover:text-blue-500"
		onclick={handleShare}
	>
		<Share2 class="h-4 w-4" />
	</Button>
	{#if authState.session?.userId === post.author.id}
		<Dropdown.Root>
			<Dropdown.Trigger>
				<EllipsisVertical />
			</Dropdown.Trigger>
			<Dropdown.Content>
				<Dropdown.Item onclick={() => (openDeleteDialog = true)}>Delete</Dropdown.Item>
			</Dropdown.Content>
		</Dropdown.Root>
	{/if}
</div>

<AlertDialog.Root open={openDeleteDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete your account and remove your data
				from our servers.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action class={buttonVariants({ variant: 'destructive' })} onclick={handleDelete}>
				{#if deleting}
					<Loader class="animate-spin" />
					Deleting
				{:else}
					Delete
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
