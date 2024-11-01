<script lang="ts">
	import type { Twiddle } from '$lib';
	import type { Snippet } from 'svelte';
	import { DeleteTwiddleDialog, SetTwiddleDialog } from '../dialog';
	import ShareTwiddleDialog from '../dialog/share-twiddle-dialog.svelte';
	import { TwiddleState, setTwiddleState } from './twiddle-state.svelte';

	interface Props {
		init: Twiddle;
		children: Snippet<[TwiddleState]>;
	}
	const { init, children }: Props = $props();

	const twiddle = $derived(setTwiddleState(init));
</script>

{@render children(twiddle)}

<DeleteTwiddleDialog bind:open={twiddle.openDeleteDialog} />
<SetTwiddleDialog bind:open={twiddle.openSetDialog} />
<ShareTwiddleDialog bind:open={twiddle.openShareDialog} />
