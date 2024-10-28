<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { Button } from '&/ui/button';
	import * as Dialog from '&/ui/dialog';
	import { getAuthState } from '../auth-state.svelte';

	const authState = $state(getAuthState());
</script>

<Dialog.Root bind:open={authState.openSignOutDialog}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Sign Out</Dialog.Title>
		</Dialog.Header>
		<Dialog.Footer>
			<form method="POST" action={route('signOut /actions/v1/auth')}>
				<Button type="submit">Sign Out</Button>
			</form>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
