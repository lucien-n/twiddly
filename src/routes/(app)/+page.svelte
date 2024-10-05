<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { Button } from '&/button';
	import { PostList, SetPostForm } from '@/post';
	import { ArrowUp } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';

	const { data } = $props();
	const { postsPromise, setPostForm }: PageData = data;

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
	class="relative h-screen w-full space-y-4 overflow-y-scroll px-1 py-4"
	bind:this={el}
	onscroll={handleScroll}
>
	<SetPostForm {setPostForm} action={route('setPost /actions/v1/post')} />

	{#if scroll > 200}
		<div transition:fade class="fixed left-0 right-0 top-3 z-10 mx-auto w-fit">
			<Button onclick={resetScroll}>
				<ArrowUp />
				<span>Back To Top</span>
			</Button>
		</div>
	{/if}

	<PostList posts={postsPromise} {setPostForm} />
</div>
