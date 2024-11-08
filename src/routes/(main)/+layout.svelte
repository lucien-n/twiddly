<script lang="ts">
	import { AuthContext } from '#/auth';
	import { AppSidebar } from '#/nav';
	import * as Sidebar from '&/ui/sidebar';
	import '../../app.css';
	import * as Breadcrumb from '&/ui/breadcrumb';
	import { page } from '$app/stores';
	import { route } from '@/lib/ROUTES';
	import { PUBLIC_ORIGIN } from '$env/static/public';

	const { children, data } = $props();

	const pathes = $derived($page.url.pathname.split('/'));
</script>

<AuthContext init={{ user: data.user, session: data.session, profile: data.profile }}>
	<Sidebar.Provider>
		<AppSidebar />

		<Sidebar.Inset class="relative flex max-h-screen min-h-screen w-full flex-col bg-muted/40">
			<header class="flex h-9 shrink-0 items-center gap-2 bg-transparent px-4">
				<Sidebar.Trigger class="-ml-1" />
				<Breadcrumb.Root>
					<Breadcrumb.List>
						{#each pathes as path, index}
							{@const className = index === 0 ? 'hidden md:block' : ''}
							{@const label =
								index === 0 ? 'Home' : path.charAt(0).toUpperCase() + path.slice(1).toLowerCase()}
							{@const href =
								index === 0 ? route('/') : PUBLIC_ORIGIN + '/' + pathes.slice(0, index).join('/')}
							<Breadcrumb.Item class={className}>
								{#if index < pathes.length - 1}
									<Breadcrumb.Link {href}>
										{label}
									</Breadcrumb.Link>
								{:else}
									<Breadcrumb.Page>
										{label}
									</Breadcrumb.Page>
								{/if}
							</Breadcrumb.Item>
							{#if index < pathes.length - 1}
								<Breadcrumb.Separator class="mt-1 hidden md:block" />
							{/if}
						{/each}
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</header>

			{@render children()}
		</Sidebar.Inset>
	</Sidebar.Provider>
</AuthContext>
