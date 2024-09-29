<script lang="ts">
	import { enhance } from '$app/forms';
	import { LoadingButton } from '$lib/components/button';
	import { route } from '$lib/ROUTES';
	import * as Dialog from '&/dialog';
	import { getAuthState } from '../auth-state.svelte';

	const authState = getAuthState();

	let loading = $state(false);
	const handleSubmit = () => {
		loading = true;

		return async () => {
			loading = false;
			authState.openSignOutDialog = false;
		};
	};
</script>

<Dialog.Root bind:open={authState.openSignOutDialog}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Sign Out</Dialog.Title>
		</Dialog.Header>
		<Dialog.Footer>
			<form action={route('POST /sign-out')} method="post" use:enhance={handleSubmit}>
				<LoadingButton type="submit" {loading}>
					{loading ? 'Signing Out' : 'Sign Out'}
				</LoadingButton>
			</form>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
