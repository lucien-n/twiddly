<script lang="ts">
	import { AuthContext } from '#/auth';
	import { AppSidebar, NavigationBreadcrumbs } from '#/nav';
	import { Separator } from '&/ui/separator';
	import * as Sidebar from '&/ui/sidebar';
	import { setMode, setTheme } from 'mode-watcher';
	import '../../app.css';
	import { Button } from '&/ui/button';

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

				{#each ['default', 'green-theme'] as theme}
					<Button onclick={() => setTheme(theme)}>
						{theme}
					</Button>
				{/each}

				<Separator orientation="vertical" class="mx-2 h-4" />

				{#each ['light', 'dark'] as const as mode}
					<Button variant="secondary" onclick={() => setMode(mode)}>
						{mode}
					</Button>
				{/each}
			</header>

			{@render children()}
		</Sidebar.Inset>
	</Sidebar.Provider>
</AuthContext>
