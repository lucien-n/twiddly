<script lang="ts">
	import { Dropdown } from '$lib/components/dropdown';
	import { Button, buttonVariants } from '&/button';
	import { getAuthState } from '@/auth/auth-state.svelte';
	import {
		EllipsisVertical,
		Heart,
		MessageCircle,
		Pencil,
		Repeat2,
		Share2,
		Trash
	} from 'lucide-svelte';
	import { getPostState } from './state/post-state.svelte';

	const authState = getAuthState();
	const post = getPostState();

	let comments = $state(0);
	const handleComment = async (event: Event) => {
		event.stopPropagation();

		comments++;
	};

	let reposts = $state(0);
	let reposted = $state(false);
	const handleRepost = async (event: Event) => {
		event.stopPropagation();

		reposted = !reposted;
		reposts += reposted ? 1 : -1;
	};

	const handleLike = async (event: Event) => {
		event.stopPropagation();

		await post.toggleLike();
	};

	const handleShare = async (event: Event) => {
		event.stopPropagation();

		post.openShareDialog = true;
	};
</script>

<div class="flex sm:space-x-5">
	<Button
		variant="ghost"
		size="icon"
		class="flex w-auto items-center space-x-2 px-2 transition-colors duration-200 hover:text-blue-500"
		onclick={handleComment}
	>
		<MessageCircle class="h-4 w-4" />
		<span>{comments}</span>
	</Button>
	<Button
		variant="ghost"
		size="icon"
		class={`flex w-auto items-center space-x-2 px-2 transition-colors duration-200 ${
			reposted ? 'text-green-500' : 'hover:text-green-500'
		}`}
		onclick={handleRepost}
	>
		<Repeat2 class="h-4 w-4" />
		<span>{reposts}</span>
	</Button>
	<Button
		variant="ghost"
		size="icon"
		class={`flex w-auto items-center space-x-2 px-2 transition-colors duration-200 ${
			post.liked ? 'text-red-500' : 'hover:text-red-500'
		}`}
		onclick={handleLike}
	>
		<Heart class={`h-4 w-4 ${post.liked ? 'fill-current' : ''}`} />
		<span>{post.likes}</span>
	</Button>
</div>
<div class="flex sm:space-x-5">
	<Button
		variant="ghost"
		size="icon"
		class="flex items-center space-x-2 transition-colors duration-200 hover:text-blue-500"
		onclick={handleShare}
	>
		<Share2 class="h-4 w-4" />
	</Button>
	{#if authState.session?.userId === post.data.author.id}
		<Dropdown
			class={buttonVariants({ variant: 'ghost', size: 'icon' })}
			items={[
				{ item: dropdownEditItem, onclick: () => (post.openSetDialog = true) },
				{ item: dropdownDeleteItem, onclick: () => (post.openDeleteDialog = true) }
			]}
			stopPropagation
		>
			<EllipsisVertical />
		</Dropdown>
	{/if}
</div>

{#snippet dropdownEditItem()}
	<Pencil size={16} />
	<span class="ml-2">Edit</span>
{/snippet}

{#snippet dropdownDeleteItem()}
	<div class="flex items-center gap-2 text-destructive">
		<Trash size={16} />
		<span>Delete</span>
	</div>
{/snippet}
