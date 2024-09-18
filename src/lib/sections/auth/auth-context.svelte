<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setAuthState, type AuthState, type SetAuthState } from './auth-state.svelte';
	import SignoutDialog from './dialogs/signout-dialog.svelte';

	interface Props {
		init: SetAuthState;
		children: Snippet<[AuthState]>;
	}
	const { init, children }: Props = $props();
	const authState = setAuthState(init);
</script>

{@render children(authState)}

<SignoutDialog />
