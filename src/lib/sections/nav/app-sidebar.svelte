<script lang="ts">
	import { getAuthState } from '#/auth';
	import { browser } from '$app/environment';
	import { navigating, page } from '$app/stores';
	import { route } from '$lib/ROUTES';
	import * as Sidebar from '&/ui/sidebar';
	import { cn } from '&/utils';
	import { Heart, Home, LogIn, Settings2, User, Users } from 'lucide-svelte';
	import { crossfade } from 'svelte/transition';
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
			action: authState.profile
				? route('/[handle=handle]/activity', { handle: authState.profile.handle })
				: '',
			icon: User,
			hidden: !isAuthenticated
		},
		{
			label: 'Liked',
			action: authState.profile
				? route('/[handle=handle]/liked', { handle: authState.profile.handle })
				: '',
			icon: Heart,
			hidden: !isAuthenticated
		}
	]);

	let adminItems: NavItemProps[] = $derived([
		{
			label: 'Settings',
			action: route('/admin/settings'),
			icon: Settings2
		},
		{
			label: 'Users',
			action: route('/admin/users'),
			icon: Users
		}
	]);

	let footerItems: NavItemProps[] = $derived([
		{ label: 'Sign In', action: route('/sign-in'), icon: LogIn, hidden: isAuthenticated }
	]);

	const key = 'nav-current-item';
	const [send, receive] = crossfade({});
</script>

{#snippet navItemContent(item: NavItemProps, isCurrent: boolean)}
	<item.icon />
	<span>{item.label}</span>
	{#if isCurrent}
		<div
			in:send={{ key }}
			out:receive={{ key }}
			class="ml-auto h-[.4rem] w-[.4rem] rounded-full bg-primary"
		></div>
	{/if}
{/snippet}

{#snippet navItem(item: NavItemProps)}
	{#if !item.hidden}
		{@const isCurrent =
			browser && typeof item.action === 'string' && $page.url.pathname === item.action}
		<Sidebar.MenuItem>
			<Sidebar.MenuButton
				data-isCurrent={isCurrent}
				class="rounded-md transition-all data-[isCurrent=true]:bg-sidebar-primary/20 data-[isCurrent=true]:text-sidebar-accent-foreground"
			>
				{#snippet child({ props })}
					{#if typeof item.action === 'string'}
						<a href={item.action} {...props}>
							{@render navItemContent(item, isCurrent)}
						</a>
					{:else}
						<button onclick={item.action} {...props}>
							{@render navItemContent(item, isCurrent)}
						</button>
					{/if}
				{/snippet}
			</Sidebar.MenuButton>
		</Sidebar.MenuItem>
	{/if}
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
							<img
								src="/twiddly.svg"
								alt="Twiddly logo"
								class={cn('p-1', browser && $navigating && 'animate-pulse')}
							/>
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
						{@render navItem(item)}
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
		{#if authState.isAdmin}
			<Sidebar.Group>
				<Sidebar.GroupLabel>Admin</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each adminItems as item (item.label)}
							{@render navItem(item)}
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/if}
	</Sidebar.Content>
	<Sidebar.Footer>
		{#if isAuthenticated}
			<NavUser />
		{:else}
			<Sidebar.Group>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each footerItems as item (item.label)}
							{@render navItem(item)}
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/if}
	</Sidebar.Footer>
</Sidebar.Root>
