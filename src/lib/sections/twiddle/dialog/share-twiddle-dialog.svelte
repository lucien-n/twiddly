<script lang="ts">
	import { copyToClipboard } from '$lib/utils/helpers';
	import { Button } from '&/button';
	import * as Dialog from '&/dialog';
	import { toast } from 'svelte-sonner';
	import { getTwiddleState } from '../state/twiddle-state.svelte';
	import { PUBLIC_ORIGIN } from '$env/static/public';
	import { route } from '$lib/ROUTES';
	import { Clipboard } from 'lucide-svelte';

	interface Props {
		open?: boolean;
	}
	let { open = $bindable() }: Props = $props();
	const twiddle = getTwiddleState();

	const url = $derived(
		new URL(
			route('/[handle]/[twiddleId]', {
				handle: twiddle.data.author.handle,
				twiddleId: twiddle.data.id
			}),
			PUBLIC_ORIGIN
		).toString()
	);
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Share twiddle</Dialog.Title>
			<Dialog.Description>Copy the link below</Dialog.Description>
		</Dialog.Header>

		<Button variant="link" href={url} class="p-0 text-lg">
			<span class="text-muted-foreground">{url.slice(0, PUBLIC_ORIGIN.length)}</span>
			<strong>{url.slice(PUBLIC_ORIGIN.length)}</strong>
		</Button>

		<Dialog.Footer>
			<Dialog.Close class="mr-3">Close</Dialog.Close>
			<Button
				on:click={() =>
					copyToClipboard(
						url,
						(message) => toast.success(message),
						(message) => toast.error(message)
					)}
			>
				<Clipboard /> <span class="ml-1">Copy</span>
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
