<script lang="ts">
	import { goto } from '$app/navigation';
	import { route } from '$lib/ROUTES';
	import * as AlertDialog from '&/alert-dialog';
	import { buttonVariants } from '&/button';
	import type { Like, Post, Profile } from '@prisma/client';
	import { LoaderCircle } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	interface Props {
		open: boolean;
		post: Pick<Post, 'id'> & {
			author: Pick<Profile, 'handle'>;
		};
	}
	let { post, open = $bindable() }: Props = $props();

	let deleted: boolean = $state(false);
	let deleting: boolean = $state(false);
	const handleDelete = async (event: Event) => {
		event.stopPropagation();
		deleting = true;
		open = true;

		const url = route('POST /api/v1/post/[id]/delete', { id: post.id });
		const res = await fetch(url, { method: 'POST' });
		if (!res.ok) {
			toast.error('An error occured');
			return;
		}

		try {
			const { data } = await res.json();
			deleted = Boolean(data);

			if (deleted) {
				goto(route('/[handle]', { handle: post.author.handle }));
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
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete your account and remove your data
				from our servers.
			</AlertDialog.Description>
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
