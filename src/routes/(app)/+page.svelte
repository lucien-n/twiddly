<script lang="ts">
	import PostCard from '@/post/post-card.svelte';
	import type { PageData } from './$types';
	import CreatePostForm from './create-post-form.svelte';
	import PostCardSkeleton from '@/post/post-card-skeleton.svelte';

	const { data } = $props();
	const { postsPromise, createPostForm }: PageData = data;
</script>

<CreatePostForm data={createPostForm} />

<div class="w-full space-y-4 py-4">
	{#await postsPromise}
		{#each { length: 5 } as _}
			<PostCardSkeleton />
		{/each}
	{:then posts}
		{#each posts as post (post.id)}
			<PostCard {post} />
		{/each}
	{/await}
</div>
