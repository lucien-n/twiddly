<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { route } from '$lib/ROUTES';
	import { Button } from '&/ui/button';
	import { ChevronRight } from 'lucide-svelte';

	const paths: { label: string; href: string }[] = [
		{
			label: 'Interface',
			href: browser ? route('/[handle]/settings/interface', { handle: $page.params.handle }) : ''
		},
		{
			label: 'Privacy',
			href: browser ? route('/[handle]/settings/privacy', { handle: $page.params.handle }) : ''
		}
	];
</script>

<div class="flex h-screen flex-col">
	<h1 class="mb-5 text-5xl font-bold">Settings</h1>

	{#each paths as { label, href }}
		<Button variant="link" {href} class="group flex w-full justify-between py-8">
			<h1 class="text-3xl font-bold">
				{label}
			</h1>

			<ChevronRight class="self-center text-muted-foreground group-hover:text-foreground" />
		</Button>
	{/each}
</div>
