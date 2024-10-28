<script lang="ts">
	import * as Sidebar from '&/ui/sidebar';
	import { route } from '$lib/ROUTES';
	import { getAuthState } from '@/auth/auth-state.svelte';
	import { Role } from '@prisma/client';
	import { Home, LayoutDashboard, LogIn, LogOut, Settings } from 'lucide-svelte';
	import * as DropdownMenu from '&/ui/dropdown-menu';
	import NavUser from './nav-user.svelte';
	import type { NavItemProps } from '.';
	import TwiddlyIcon from '../../../../static/favicon.svg?raw';

	const authState = getAuthState();
	const sidebar = Sidebar.useSidebar();

	const isAuthenticated = $derived(!!authState.session);

	let items: NavItemProps[] = $state([]);
	let footerItems: NavItemProps[] = $state([]);
	$effect(() => {
		items = [
			{
				label: 'Home',
				action: route('/'),
				icon: Home
			},
			{
				label: 'Admin Dashboard',
				action: route('/'), // todo: admin page
				icon: LayoutDashboard,
				hidden: authState.profile?.role !== Role.ADMIN
			}
		];
	});

	$effect(() => {
		footerItems = isAuthenticated
			? []
			: [
					{
						label: 'Sign Out',
						action: () => authState.toggleOpenSignOutDialog(),
						icon: LogOut,
						hidden: !isAuthenticated
					},
					{
						label: 'Settings',
						action: route('/settings'),
						icon: Settings,
						hidden: !isAuthenticated
					}
				];
	});
</script>

{#snippet navItem(item: NavItemProps)}
	<item.icon />
	<span>{item.label}</span>
{/snippet}

<Sidebar.Root collapsible="icon">
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Sidebar.MenuButton
								{...props}
								size="lg"
								class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<div
									class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
								>
									<img src="/favicon.svg" alt="Twiddly logo" class="p-[.07rem]" />
								</div>
								<div class="grid flex-1 text-left text-sm leading-tight">
									<span class="truncate font-semibold"> Twiddly </span>
								</div>
							</Sidebar.MenuButton>
						{/snippet}
					</DropdownMenu.Trigger>
				</DropdownMenu.Root>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each items as item (item.label)}
						{#if !item.hidden}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton>
									{#snippet child({ props })}
										{#if typeof item.action === 'string'}
											<a href={item.action} {...props}>
												{@render navItem(item)}
											</a>
										{:else}
											<button onclick={item.action} {...props}>
												{@render navItem(item)}
											</button>
										{/if}
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/if}
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer>
		{#if isAuthenticated}
			<NavUser />
		{:else}
			<Sidebar.Group>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each [{ label: 'Sign In', action: route('/sign-in'), icon: LogIn, hidden: isAuthenticated }] as item (item.label)}
							{#if !item.hidden}
								<Sidebar.MenuItem>
									<Sidebar.MenuButton>
										{#snippet child({ props })}
											{#if typeof item.action === 'string'}
												<a href={item.action} {...props}>
													{@render navItem(item)}
												</a>
											{:else}
												<button onclick={item.action} {...props}>
													{@render navItem(item)}
												</button>
											{/if}
										{/snippet}
									</Sidebar.MenuButton>
								</Sidebar.MenuItem>
							{/if}
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/if}
	</Sidebar.Footer>
</Sidebar.Root>
