<script>
	import { AuthContext, NonVerifiedBanner } from '@/auth';
	import * as Sidebar from '&/ui/sidebar';
	import { AppSidebar } from '@/nav';
	import '../../app.css';

	const { children, data } = $props();

	let bannerOpen = $state(!!data.user && !data.user?.emailVerified);
</script>

<AuthContext init={{ user: data.user, session: data.session, profile: data.profile }}>
	<Sidebar.Provider>
		<AppSidebar />

		<div class="flex min-h-screen w-full flex-col bg-muted/40">
			<NonVerifiedBanner bind:open={bannerOpen} />

			<main class="mx-auto flex h-screen w-full flex-col overflow-hidden sm:max-w-3xl sm:gap-4">
				{@render children()}
			</main>
		</div>
	</Sidebar.Provider>
</AuthContext>
