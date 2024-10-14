<script lang="ts">
	import type { Snippet } from 'svelte';
	import { TwiddleState, setTwiddleState, type TwiddleStateInit } from './twiddle-state.svelte';
	import { DeleteTwiddleDialog, SetTwiddleDialog } from '../dialog';
	import ShareTwiddleDialog from '../dialog/share-twiddle-dialog.svelte';

	interface Props {
		init: TwiddleStateInit;
		children: Snippet<[TwiddleState]>;
	}
	const { init, children }: Props = $props();

	const twiddle = $state(setTwiddleState(init));
	$effect(() => {
		twiddle.data = init.data;
	});
</script>

{@render children(twiddle)}

<DeleteTwiddleDialog bind:open={twiddle.openDeleteDialog} />
<SetTwiddleDialog bind:open={twiddle.openSetDialog} />
<ShareTwiddleDialog bind:open={twiddle.openShareDialog} />
