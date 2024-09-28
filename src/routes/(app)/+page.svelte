<script lang="ts">
	import type { PageData } from './$types';
	import CreatePostForm from './create-post-form.svelte';
	import { PostCard, PostCardSkeleton } from '@/post';
	import { Button } from '&/button';
	import { ArrowUp } from 'lucide-svelte';

	const { data } = $props();
	const { postsPromise, createPostForm }: PageData = data;

	let el: HTMLElement | undefined = $state();
	let scroll: number = $state(0);
	const handleScroll = (event: Event) => {
		const target = event.target as HTMLDivElement;
		scroll = target.scrollTop;
	};

	const resetScroll = () => {
		if (!el) return;
		el.scrollTo({ top: 0, behavior: 'smooth' });
	};
</script>

<div
	class="realtive w-full space-y-4 overflow-y-scroll py-4"
	bind:this={el}
	onscroll={handleScroll}
>
	<CreatePostForm data={createPostForm} />

	{#if scroll > 200}
		<Button class="absolute left-0 right-0 top-3 z-10 mx-auto w-fit" onclick={resetScroll}>
			<ArrowUp />
			<span>Back To Top</span>
		</Button>
	{/if}

	{#await postsPromise}
		<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
		{#each { length: 5 } as _}
			<PostCardSkeleton />
		{/each}
	{:then posts}
		{#each posts as post (post.id)}
			<PostCard {post} />
		{/each}
	{/await}
</div>
