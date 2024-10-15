<script lang="ts">
	import { enhance } from '$app/forms';
	import { route } from '$lib/ROUTES';
	import * as AlertDialog from '&/alert-dialog';
	import { buttonVariants } from '&/button';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { LoaderCircle } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	interface Props {
		open: boolean;
	}
	let { open = $bindable() }: Props = $props();

	let loading = $state(false);
	const handleSubmit: SubmitFunction = () => {
		loading = true;

		return async ({ result, update }) => {
			await update();

			loading = false;

			if (result.type === 'error') toast.error('An error occured');
		};
	};
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete account</AlertDialog.Title>
			<AlertDialog.Description
				>This action CAN be undone.<br />Your account will be marked for deletion after 30 days.</AlertDialog.Description
			>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<form
				action={route('deleteAccount /actions/v1/auth')}
				method="post"
				use:enhance={handleSubmit}
			>
				<AlertDialog.Action type="submit" class={buttonVariants({ variant: 'destructive' })}>
					{#if loading}
						<LoaderCircle class="animate-spin" />
						<span class="ml-2">Deleting</span>
					{:else}
						Delete
					{/if}
				</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
