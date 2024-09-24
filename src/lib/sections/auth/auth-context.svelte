<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setAuthState, type AuthState, type SetAuthState } from './auth-state.svelte';
	import SignoutDialog from './dialogs/signout-dialog.svelte';
	import { getModeWatcherTheme } from '$lib/utils/theme';
	import { setMode } from 'mode-watcher';

	interface Props {
		init: SetAuthState;
		children: Snippet<[AuthState]>;
	}
	const { init, children }: Props = $props();
	const authState = setAuthState(init);

	$effect(() => {
		setMode(getModeWatcherTheme(init.profile?.interfaceSettings?.theme));
	});
</script>

{@render children(authState)}

<SignoutDialog />
