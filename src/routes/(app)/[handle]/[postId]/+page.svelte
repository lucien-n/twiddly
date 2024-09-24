<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { formatDate } from '$lib/utils/date';
	import { Button } from '&/button';
	import ProfileAvatar from '@/profile/avatar/profile-avatar.svelte';
	import type { PageData } from './$types';
	import PostFooter from '@/post/post-footer.svelte';

	const { data } = $props();
	const { postPromise }: PageData = data;
</script>

{#await postPromise}
	<!-- todo: skeleton -->
	<p>loading post</p>
{:then post}
	{#if post}
		<div class="p-4">
			<div class="mb-2 flex items-center gap-3 p-6">
				<ProfileAvatar profile={post.author} />
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
			<div class="p-6 pt-0">
				<p class="mb-4 text-xl">
					{post.content}
				</p>
				<p class="mb-4 text-sm text-muted-foreground">{formatDate(post.createdAt)}</p>
			</div>
			<div class="flex items-center justify-between p-6 py-3 pt-0">
				<PostFooter
					{post}
					onRepost={() => new Promise((r) => setTimeout(r, 1_500))}
					onLike={() => new Promise((r) => setTimeout(r, 1_500))}
				/>
			</div>
		</div>
	{:else}
		<!-- todo -->
		<p>post not found</p>
	{/if}
{/await}
