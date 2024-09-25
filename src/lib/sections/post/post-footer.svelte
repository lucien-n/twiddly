<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { isLiked } from '$lib/utils/post';
	import { Button } from '&/button';
	import { getAuthState } from '@/auth/auth-state.svelte';
	import type { Like, Post, Profile } from '@prisma/client';
	import { EllipsisVertical, Heart, MessageCircle, Repeat2, Share2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import DeletePostDialog from './dialog/delete-post-dialog.svelte';
	import { Dropdown } from '$lib/components/dropdown';

	interface Props {
		post: Pick<Post, 'id' | 'likeCount'> & {
			author: Pick<Profile, 'id' | 'handle'>;
		} & {
			likes: Pick<Like, 'profileId'>[];
		};
	}
	let { post }: Props = $props();

	const authState = getAuthState();

	let openDeleteDialog: boolean = $state(false);

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
		<Dropdown items={[{ item: 'Delete', onclick: () => (openDeleteDialog = true) }]}>
			<EllipsisVertical />
		</Dropdown>
	{/if}
</div>

<DeletePostDialog bind:open={openDeleteDialog} {post} />
