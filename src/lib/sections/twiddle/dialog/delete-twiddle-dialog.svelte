<script lang="ts">
	import * as AlertDialog from '&/ui/alert-dialog';
	import { buttonVariants } from '&/ui/button';
	import { LoaderCircle } from 'lucide-svelte';
	import { getTwiddleState } from '../state/twiddle-state.svelte';

	interface Props {
		open?: boolean;
	}
	let { open = $bindable() }: Props = $props();
	const twiddle = getTwiddleState();

	let deleting: boolean = $state(false);
	const handleDelete = async (event: Event) => {
		event.stopPropagation();
		deleting = true;
		open = true;

		await twiddle.delete();

		deleting = false;
		open = false;
	};
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete twiddle</AlertDialog.Title>
			<AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				class={buttonVariants({ variant: 'destructive' })}
				onclick={handleDelete}
				disabled={deleting}
			>
				{#if deleting}
					<LoaderCircle class="animate-spin" />
					<span class="ml-2">Deleting</span>
				{:else}
					Delete
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
