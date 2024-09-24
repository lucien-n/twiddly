<script lang="ts">
	import { Button } from '&/button';
	import type { Post, Profile } from '@prisma/client';
	import { Heart, MessageCircle, Repeat2, Share2 } from 'lucide-svelte';

	interface Props {
		post: Pick<Post, 'id'> & {
			author: Pick<Profile, 'handle'>;
		};
		onRepost: () => Promise<boolean>;
		onLike: () => Promise<boolean>;
	}
	const { post, onRepost, onLike }: Props = $props();

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

		const success = await onRepost();
		if (!success) {
			reposted = !reposted;
			reposts += reposted ? 1 : -1;
			return;
		}
	};

	let likes = $state(0);
	let liked = $state(false);
	const handleLike = async (event: Event) => {
		event.stopPropagation();

		liked = !liked;
		likes += liked ? 1 : -1;

		const success = await onLike();
		if (!success) {
			liked = !liked;
			likes += liked ? 1 : -1;
			return;
		}
	};

	const handleShare = async (event: Event) => {
		event.stopPropagation();
	};
</script>

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
<Button
	variant="ghost"
	size="sm"
	class="flex items-center space-x-2 transition-colors duration-200 hover:text-blue-500"
	onclick={handleShare}
>
	<Share2 class="h-4 w-4" />
</Button>
