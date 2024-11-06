<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setAuthState, type AuthState, type SetAuthState } from './auth-state.svelte';
	import { SignOutDialog } from '.';
	import { getModeWatcherTheme } from '$lib/utils/theme';
	import { setMode } from 'mode-watcher';

	interface Props {
		init: SetAuthState;
		children: Snippet<[AuthState]>;
	}
	const { init, children }: Props = $props();
	const authState = setAuthState(init);

	$effect(() => {
		authState.user = init.user;
		authState.session = init.session;
		authState.profile = init.profile;
	});

	$effect(() => {
		setMode(getModeWatcherTheme(init.profile?.interfaceSettings?.theme));
	});
</script>

{@render children(authState)}

<SignOutDialog />
