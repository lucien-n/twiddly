<script lang="ts">
	import type { Snippet } from 'svelte';
	import { PostState, setPostState, type PostStateInit } from './post-state.svelte';
	import { DeletePostDialog, SetPostDialog } from '../dialog';
	import SharePostDialog from '../dialog/share-post-dialog.svelte';

	interface Props {
		init: PostStateInit;
		children: Snippet<[PostState]>;
	}
	const { init, children }: Props = $props();

	const post = $state(setPostState(init));
	$effect(() => {
		post.data = init.data;
	});
</script>

{@render children(post)}

<DeletePostDialog bind:open={post.openDeleteDialog} />
<SetPostDialog bind:open={post.openSetDialog} />
<SharePostDialog bind:open={post.openShareDialog} />
