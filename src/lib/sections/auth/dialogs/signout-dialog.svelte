<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { Button } from '&/button';
	import * as Dialog from '&/dialog';
	import { getAuthState } from '../auth.state.svelte';

	const authState = getAuthState();
</script>

<Dialog.Root bind:open={authState.openSignOutDialog}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Sign Out</Dialog.Title>
		</Dialog.Header>
		<Dialog.Footer>
			<form action={route('POST /sign-out')} method="post">
				<Button type="submit">Sign Out</Button>
			</form>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
