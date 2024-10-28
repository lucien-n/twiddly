<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { Button } from '&/ui/button';
	import { DeleteAccountDialog } from '@/auth';
	import { ChevronRight } from 'lucide-svelte';

	const paths: { label: string; href: string }[] = [
		{
			label: 'Interface',
			href: route('/settings/interface')
		},
		{
			label: 'Privacy',
			href: route('/settings/privacy')
		}
	];

	let openDeleteAccountDialog = $state(false);
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

	<Button
		variant="destructive"
		class="mb-5 mt-auto"
		onclick={() => (openDeleteAccountDialog = true)}
	>
		Delete account
	</Button>
</div>

<DeleteAccountDialog bind:open={openDeleteAccountDialog} />
