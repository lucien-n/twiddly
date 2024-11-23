<script lang="ts">
	import { AuthContext } from '#/auth';
	import { AppSidebar } from '#/nav';
	import * as Sidebar from '&/ui/sidebar';
	import '../../app.css';
	import { NavigationBreadcrumbs } from '#/nav';
	import { Separator } from '&/ui/separator';

	const { children, data } = $props();
</script>

<AuthContext init={{ user: data.user, session: data.session, profile: data.profile }}>
	<Sidebar.Provider>
		<AppSidebar />

		<Sidebar.Inset class="relative flex max-h-screen min-h-screen w-full flex-col bg-background">
			<header
				class="sticky top-0 flex h-12 shrink-0 items-center gap-2 border-b bg-background px-4"
			>
				<Sidebar.Trigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 h-4" />
				<NavigationBreadcrumbs />
			</header>

			{@render children()}
		</Sidebar.Inset>
	</Sidebar.Provider>
</AuthContext>
