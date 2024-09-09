<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setAuthState, type AuthState, type SetAuthState } from './auth.state.svelte';

	interface Props {
		init: SetAuthState;
		children: Snippet<[AuthState]>;
	}
	const { init, children }: Props = $props();
	const data = setAuthState(init);
</script>

{@render children(data)}
