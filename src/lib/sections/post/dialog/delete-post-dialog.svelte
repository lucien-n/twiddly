<script lang="ts">
	import { goto } from '$app/navigation';
	import { route } from '$lib/ROUTES';
	import * as AlertDialog from '&/alert-dialog';
	import { buttonVariants } from '&/button';
	import { LoaderCircle } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { getPostState } from '../state/post-state.svelte';
	import { page } from '$app/stores';

	interface Props {
		open?: boolean;
	}
	let { open = $bindable() }: Props = $props();
	const postState = getPostState();

	let deleting: boolean = $state(false);
	const handleDelete = async (event: Event) => {
		event.stopPropagation();
		deleting = true;
		open = true;

		const url = route('POST /api/v1/post/[id]/delete', { id: postState.post.id });
		const res = await fetch(url, { method: 'POST' });
		if (!res.ok) {
			toast.error('An error occured');
			return;
		}

		try {
			const { data } = await res.json();
			postState.deleted = Boolean(data);

			const profileRoute = route('/[handle]', { handle: postState.post.author.handle });
			if (postState.deleted && $page.url.pathname.startsWith(profileRoute)) {
				goto(profileRoute);
				toast.success('Success !');
			}
		} catch {
			toast.error('An error occured');
		}

		deleting = false;
		open = false;
	};
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete post</AlertDialog.Title>
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
