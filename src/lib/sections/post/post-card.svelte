<script lang="ts">
	import { goto } from '$app/navigation';
	import { route } from '$lib/ROUTES';
	import { formatDate } from '$lib/utils/date';
	import { Button } from '&/button';
	import * as Card from '&/card';
	import { ProfileAvatar } from '@/profile';
	import PostFooter from './post-footer.svelte';
	import { getPostState } from './state/post-state.svelte';

	const postState = getPostState();

	const redirectToPost = () => {
		goto(
			route('/[handle]/[postId]', {
				handle: postState.post.author.handle,
				postId: postState.post.id
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
			<a href={route('/[handle]', { handle: postState.post.author.handle })}>
				<ProfileAvatar profile={postState.post.author} />
			</a>
			<div>
				<p class="font-semibold">{postState.post.author.displayName}</p>
				<Button
					variant="link"
					href={route('/[handle]', { handle: postState.post.author.handle })}
					class="h-0 p-0 text-sm text-gray-500"
				>
					@{postState.post.author.handle}
				</Button>
			</div>
		</div>
	</Card.Header>
	<Card.Content>
		<p class="mb-2 text-foreground">{postState.post.content}</p>
		<p class="flex gap-1 text-sm text-muted-foreground">
			<span>
				{formatDate(postState.post.createdAt)}E
			</span>
			{#if postState.post.edited}
				<span>·</span>
				<span>Edited</span>
			{/if}
		</p>
	</Card.Content>
	<Card.Footer class="justify-between py-3">
		<PostFooter />
	</Card.Footer>
</Card.Root>
