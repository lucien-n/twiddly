<script>
	import { route } from '$lib/ROUTES';
	import { Button } from '&/button';
	import { AuthContext } from '@/auth';
	import { SideNav } from '@/nav';
	import '../../app.css';
	import { MailWarning, X } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	const { children, data } = $props();

	let unverifiedBannerOpen = $state(!data.user?.emailVerified);
</script>

<AuthContext init={{ user: data.user, session: data.session, profile: data.profile }}>
	<div class="flex min-h-screen w-full flex-col bg-muted/40">
		<SideNav />

		{#if unverifiedBannerOpen}
			<section class="absolute bottom-0 z-[5] flex w-full bg-secondary" transition:fly={{ y: 20 }}>
				<div class="ml-auto flex items-center">
					<MailWarning />
					<p class="ml-2">
						You did not verify your email yet, you can do so
						<Button variant="link" href={route('/verify')} class="px-0">here</Button>
					</p>
				</div>
				<Button
					variant="ghost"
					size="icon"
					onclick={() => (unverifiedBannerOpen = false)}
					class="ml-auto mr-2"
				>
					<X />
				</Button>
			</section>
		{/if}

		<section
			class="mx-auto flex h-screen w-full flex-col overflow-hidden px-11 shadow-md sm:max-w-3xl sm:gap-4"
		>
			{@render children()}
		</section>
	</div>
</AuthContext>
