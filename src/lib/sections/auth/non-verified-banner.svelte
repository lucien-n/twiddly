<script lang="ts">
	import { MailWarning, X } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { route } from '$lib/ROUTES';
	import { Button } from '&/ui/button';

	interface Props {
		open: boolean;
	}
	let { open = $bindable(false) }: Props = $props();
</script>

{#if open}
	<footer
		class="absolute bottom-0 z-[5] flex h-14 w-full border-t bg-background"
		transition:fly={{ y: -20, duration: 150 }}
	>
		<div class="ml-auto flex items-center">
			<MailWarning />
			<p class="ml-2">
				You did not verify your email yet, you can do so
				<Button variant="link" href={route('/verify')} class="px-0">here</Button>
			</p>
		</div>
		<Button variant="ghost" size="icon" onclick={() => (open = false)} class="my-auto ml-auto mr-2">
			<X />
		</Button>
	</footer>
{/if}
