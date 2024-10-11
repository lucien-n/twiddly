<script lang="ts">
	import { goto } from '$app/navigation';
	import { route } from '$lib/ROUTES';
	import { formatDate } from '$lib/utils/date';
	import { Button } from '&/button';
	import * as Card from '&/card';
	import { ProfileAvatar } from '@/profile';
	import PostFooter from './post-footer.svelte';
	import { getPostState } from './state/post-state.svelte';

	const post = getPostState();

	const redirectToPost = () => {
		goto(
			route('/[handle]/[postId]', {
				handle: post.data.author.handle,
				postId: post.data.id
			})
		);
	};
</script>

<Card.Root
	class="mx-auto transition-shadow duration-300 hover:cursor-pointer hover:shadow-lg"
	onclick={redirectToPost}
>
	<Card.Header>
		<div class="flex items-center space-x-4">
			<a href={route('/[handle]', { handle: post.data.author.handle })}>
				<ProfileAvatar profile={post.data.author} />
			</a>
			<div>
				<p class="font-semibold">{post.data.author.displayName}</p>
				<Button
					variant="link"
					href={route('/[handle]', { handle: post.data.author.handle })}
					class="h-0 p-0 text-sm text-gray-500"
				>
					@{post.data.author.handle}
				</Button>
			</div>
		</div>
	</Card.Header>
	<Card.Content>
		<p class="mb-2 text-foreground">{post.data.content}</p>
		<p class="flex gap-1 text-sm text-muted-foreground">
			<span>
				{formatDate(post.data.createdAt)}E
			</span>
			{#if post.data.editedAt}
				<span>·</span>
				<span>Edited</span>
			{/if}
		</p>
	</Card.Content>
	<Card.Footer class="justify-between py-3">
		<PostFooter />
	</Card.Footer>
</Card.Root>
