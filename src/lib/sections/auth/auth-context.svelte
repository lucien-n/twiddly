<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setAuthState, type AuthState, type SetAuthState } from './auth-state.svelte';
	import { SignOutDialog } from '.';
	import { getModeWatcherThemeMode, getModeWatcherThemeColor } from '$lib/utils/theme';
	import { mode, setMode, setTheme, theme } from 'mode-watcher';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

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
		const userMode = getModeWatcherThemeMode(init.profile?.interfaceSettings?.themeMode);
		if ($mode === userMode || (browser && $page.url.pathname.startsWith('/settings/interface'))) {
			return;
		}

		setMode(userMode);
	});

	$effect(() => {
		const userColor = getModeWatcherThemeColor(init.profile?.interfaceSettings?.themeColor);
		if ($theme === userColor || (browser && $page.url.pathname.startsWith('/settings/interface'))) {
			return;
		}

		setTheme(userColor);
	});
</script>

{@render children(authState)}

<SignOutDialog />
