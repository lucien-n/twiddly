<script lang="ts">
	import { Dropdown } from '&/dropdown';
	import { Button, buttonVariants } from '&/ui/button';
	import { getAuthState } from '#/auth/auth-state.svelte';
	import { EllipsisVertical, Heart, MessageCircle, Pencil, Share2, Trash } from 'lucide-svelte';
	import { getTwiddleState } from './state/twiddle-state.svelte';
	import { route } from '$lib/ROUTES';

	const authState = getAuthState();
	const twiddle = $state(getTwiddleState());
	const isAuthor = $derived(authState.profile?.id === twiddle.data.author.id);

	const handleLike = async (event: Event) => {
		event.stopPropagation();

		await twiddle.toggleLike();
	};

	const handleShare = async (event: Event) => {
		event.stopPropagation();

		twiddle.openShareDialog = true;
	};
</script>

<div class="flex sm:space-x-5">
	<Button
		variant="ghost"
		size="icon"
		class="flex w-auto items-center space-x-2 px-2 transition-colors duration-200 hover:text-blue-500"
		onclick={(event) => event.stopPropagation()}
		href={route('/[handle]/[twiddleId]', {
			handle: twiddle.data.author.handle,
			twiddleId: twiddle.data.id
		})}
	>
		<MessageCircle class="h-4 w-4" />
		<span>{twiddle.data.commentCount}</span>
	</Button>

	<Button
		variant="ghost"
		size="icon"
		class={`flex w-auto items-center space-x-2 px-2 transition-colors duration-200 ${
			twiddle.data.isLiked ? 'text-red-500' : 'hover:text-red-500'
		}`}
		onclick={handleLike}
	>
		<Heart class={`h-4 w-4 ${twiddle.data.isLiked ? 'fill-current' : ''}`} />
		<span>{twiddle.data.likeCount}</span>
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
	{#if isAuthor || authState.isAdmin}
		<Dropdown
			class={buttonVariants({ variant: 'ghost', size: 'icon' })}
			items={[
				{ item: dropdownEditItem, onclick: () => (twiddle.openSetDialog = true) },
				{ item: dropdownDeleteItem, onclick: () => (twiddle.openDeleteDialog = true) }
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
