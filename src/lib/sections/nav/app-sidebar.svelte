<script lang="ts">
	import { route } from '$lib/ROUTES';
	import * as Sidebar from '&/ui/sidebar';
	import { getAuthState } from '@/auth/auth-state.svelte';
	import { Role } from '@prisma/client';
	import { User, Home, LayoutDashboard, LogIn } from 'lucide-svelte';
	import type { NavItemProps } from '.';
	import NavUser from './nav-user.svelte';

	const authState = getAuthState();

	const isAuthenticated = $derived(!!authState.session);

	let items: NavItemProps[] = $derived([
		{
			label: 'Home',
			action: route('/'),
			icon: Home
		},
		{
			label: 'Profile',
			action: authState.profile ? route('/[handle]', { handle: authState.profile.handle }) : '',
			icon: User,
			hidden: !isAuthenticated
		},
		{
			label: 'Admin Dashboard',
			action: route('/'), // todo: admin page
			icon: LayoutDashboard,
			hidden: authState.profile?.role !== Role.ADMIN
		}
	]);
</script>

{#snippet navItem(item: NavItemProps)}
	<item.icon />
	<span>{item.label}</span>
{/snippet}

<Sidebar.Root collapsible="icon">
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuButton
				size="lg"
				class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
			>
				{#snippet child({ props })}
					<a {...props} href={route('/')}>
						<div
							class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
						>
							<img src="/twiddly.svg" alt="Twiddly logo" class="p-1" />
						</div>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold">Twiddly</span>
						</div>
					</a>
				{/snippet}
			</Sidebar.MenuButton>
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
