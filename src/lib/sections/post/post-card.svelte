<script lang="ts">
	import * as Avatar from '&/avatar';
	import { Button } from '&/button';
	import * as Card from '&/card';
	import type { Post, Profile } from '@prisma/client';
	import { Heart, MessageCircle, Repeat2, Share2 } from 'lucide-svelte';

	const {
		content,
		createdAt,
		author
	}: Pick<Post, 'id' | 'content' | 'createdAt'> & {
		author: Pick<Profile, 'id' | 'displayName'>;
	} = $props();

	const formatDate = (date: Date) =>
		new Intl.DateTimeFormat('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: true,
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		}).format(date);

	let reposts = $state(0);
	let reposted = $state(false);
	const handleRepost = () => {
		reposted = !reposted;
		reposts += reposted ? 1 : -1;
	};

	let likes = $state(0);
	let liked = $state(false);
	const handleLike = () => {
		liked = !liked;
		likes += liked ? 1 : -1;
	};
</script>

<Card.Root class="mx-auto max-w-md transition-shadow duration-300 hover:shadow-lg">
	<Card.Header>
		<div class="flex items-center space-x-4">
			<Avatar.Root>
				<Avatar.Image
					src="https://api.dicebear.com/9.x/notionists-neutral/svg?seed={author.displayName}"
					alt={author.displayName}
				/>
				<Avatar.Fallback>{author.displayName.charAt(0)}</Avatar.Fallback>
			</Avatar.Root>
			<div>
				<p class="font-semibold">{author.displayName}</p>
				<p class="text-sm text-gray-500">@username</p>
			</div>
		</div>
	</Card.Header>
	<Card.Content>
		<p class="mb-2 text-gray-700">{content}</p>
		<p class="text-sm text-gray-500">{formatDate(createdAt)}</p>
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<Button
			variant="ghost"
			size="sm"
			class="flex items-center space-x-2 transition-colors duration-200 hover:text-blue-500"
		>
			<MessageCircle class="h-4 w-4" />
			<span>0</span>
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
		>
			<Share2 class="h-4 w-4" />
		</Button>
	</Card.Footer>
</Card.Root>
