<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { Button } from '&/button';
	import * as Card from '&/card';
	import { ProfileAvatar } from '@/profile/avatar';
	import type { Post, Profile } from '@prisma/client';
	import { Heart, MessageCircle, Repeat2, Share2 } from 'lucide-svelte';

	const {
		content,
		createdAt,
		author
	}: Pick<Post, 'id' | 'content' | 'createdAt'> & {
		author: Pick<Profile, 'id' | 'displayName' | 'handle'>;
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

<Card.Root class="mx-auto transition-shadow duration-300 hover:shadow-lg">
	<Card.Header>
		<div class="flex items-center space-x-4">
			<a href={route('/[handle]', { handle: author.handle })}>
				<ProfileAvatar profile={author} />
			</a>
			<div>
				<p class="font-semibold">{author.displayName}</p>
				<Button
					variant="link"
					href={route('/[handle]', { handle: author.handle })}
					class="h-0 p-0 text-sm text-gray-500"
				>
					@{author.handle}
				</Button>
			</div>
		</div>
	</Card.Header>
	<Card.Content>
		<p class="mb-2 text-foreground">{content}</p>
		<p class="text-sm text-muted-foreground">{formatDate(createdAt)}</p>
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
