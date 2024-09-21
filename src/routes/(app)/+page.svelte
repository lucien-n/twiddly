<script lang="ts">
	import PostCard from '@/post/post-card.svelte';
	import type { PageData } from './$types';
	import CreatePostForm from './create-post-form.svelte';

	const { data } = $props();
	const { postsPromise, createPostForm }: PageData = data;
</script>

<CreatePostForm data={createPostForm} />

{#await postsPromise}
	<p>loading posts</p>
{:then posts}
	<div class="w-full space-y-4 py-4">
		{#each posts as post (post.id)}
			<PostCard {...post} />
		{/each}
	</div>
{/await}
