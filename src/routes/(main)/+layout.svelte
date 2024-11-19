<script lang="ts">
	import { AuthContext } from '#/auth';
	import { AppSidebar } from '#/nav';
	import * as Sidebar from '&/ui/sidebar';
	import '../../app.css';
	import { NavigationBreadcrumbs } from '#/nav';

	const { children, data } = $props();
</script>

<AuthContext init={{ user: data.user, session: data.session, profile: data.profile }}>
	<Sidebar.Provider>
		<AppSidebar />

		<Sidebar.Inset class="relative flex max-h-screen min-h-screen w-full flex-col bg-muted/40">
			<header class="flex h-9 shrink-0 items-center gap-2 bg-transparent px-4">
				<Sidebar.Trigger class="-ml-1" />
				<NavigationBreadcrumbs />
			</header>

			{@render children()}
		</Sidebar.Inset>
	</Sidebar.Provider>
</AuthContext>
