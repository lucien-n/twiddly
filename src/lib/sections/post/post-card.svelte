<script lang="ts">
	import { goto } from '$app/navigation';
	import { route } from '$lib/ROUTES';
	import { formatDate } from '$lib/utils/date';
	import { Button } from '&/button';
	import * as Card from '&/card';
	import { ProfileAvatar } from '@/profile/avatar';
	import type { Post, Profile } from '@prisma/client';
	import PostFooter from './post-footer.svelte';

	const {
		...post
	}: Pick<Post, 'id' | 'content' | 'createdAt'> & {
		author: Pick<Profile, 'id' | 'displayName' | 'handle'>;
	} = $props();

	const redirectToPost = () => {
		goto(route('/[handle]/[postId]', { handle: post.author.handle, postId: post.id }));
	};
</script>

<Card.Root
	class="mx-auto transition-shadow duration-300 hover:cursor-pointer hover:shadow-lg"
	onclick={redirectToPost}
>
	<Card.Header>
		<div class="flex items-center space-x-4">
			<a href={route('/[handle]', { handle: post.author.handle })}>
				<ProfileAvatar profile={post.author} />
			</a>
			<div>
				<p class="font-semibold">{post.author.displayName}</p>
				<Button
					variant="link"
					href={route('/[handle]', { handle: post.author.handle })}
					class="h-0 p-0 text-sm text-gray-500"
				>
					@{post.author.handle}
				</Button>
			</div>
		</div>
	</Card.Header>
	<Card.Content>
		<p class="mb-2 text-foreground">{post.content}</p>
		<p class="text-sm text-muted-foreground">{formatDate(post.createdAt)}</p>
	</Card.Content>
	<Card.Footer class="justify-between py-3">
		<PostFooter
			{post}
			onRepost={() => new Promise((r) => setTimeout(r, 1_500))}
			onLike={() => new Promise((r) => setTimeout(r, 1_500))}
		/>
	</Card.Footer>
</Card.Root>
