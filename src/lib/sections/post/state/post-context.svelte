<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setPostState, type PostStateInit } from './post-state.svelte';
	import { DeletePostDialog, SetPostDialog } from '../dialog';

	interface Props {
		init: PostStateInit;
		children: Snippet;
	}
	const { init, children }: Props = $props();
	const postState = setPostState(init);
</script>

{@render children()}

<DeletePostDialog bind:open={postState.openDeleteDialog} />
<SetPostDialog bind:open={postState.openSetDialog} />
