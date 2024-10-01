<script lang="ts">
	import type { Snippet } from 'svelte';
	import { PostState, setPostState, type PostStateInit } from './post-state.svelte';
	import { DeletePostDialog, SetPostDialog } from '../dialog';

	interface Props {
		init: PostStateInit;
		children: Snippet<[PostState]>;
	}
	const { init, children }: Props = $props();

	const postState = $state(setPostState(init));
	$effect(() => {
		postState.post = init.post;
	});
</script>

{@render children(postState)}

<DeletePostDialog bind:open={postState.openDeleteDialog} />
<SetPostDialog bind:open={postState.openSetDialog} />
