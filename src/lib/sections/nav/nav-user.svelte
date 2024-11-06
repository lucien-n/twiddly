<script lang="ts">
	import { route } from '$lib/ROUTES';
	import * as DropdownMenu from '&/ui/dropdown-menu';
	import * as Sidebar from '&/ui/sidebar';
	import { useSidebar } from '&/ui/sidebar';
	import { getAuthState } from '#/auth';
	import { ProfileAvatar } from '#/profile';
	import { ChevronsUpDown, LogOut, Settings } from 'lucide-svelte';
	import type { NavItemProps } from '.';
	import { cn } from '&/utils';

	const authState = getAuthState();
	const sidebar = useSidebar();

	const isAuthenticated = $derived(!!authState.session);
	const groups: NavItemProps[][] = $derived([
		[
			{
				label: 'Settings',
				action: route('/settings'),
				icon: Settings,
				hidden: !isAuthenticated
			},
			{
				label: 'Sign Out',
				action: () => authState.toggleOpenSignOutDialog(),
				icon: LogOut,
				hidden: !isAuthenticated
			}
		]
	]);
</script>

{#snippet renderItemContent(item: NavItemProps)}
	<item.icon />
	<span>{item.label}</span>
{/snippet}

{#snippet renderItem(item: NavItemProps, props: Record<string, unknown>)}
	{#if typeof item.action === 'function'}
		<button
			{...props}
			onclick={item.action}
			class={cn(props.class as string, 'w-full cursor-pointer')}
		>
			{@render renderItemContent(item)}
		</button>
	{:else}
		<a {...props} href={item.action} class={cn(props.class as string, 'w-full cursor-pointer')}>
			{@render renderItemContent(item)}
		</a>
	{/if}
{/snippet}

{#key authState}
	<Sidebar.Menu>
		<Sidebar.MenuItem>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Sidebar.MenuButton
							size="lg"
							class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							{...props}
						>
							<ProfileAvatar size="sm" profile={authState.profile} />
							<div class="grid flex-1 text-left text-sm leading-tight">
								<span class="truncate font-semibold">{authState.profile?.displayName}</span>
								<span class="truncate text-xs">@{authState.profile?.handle}</span>
							</div>
							<ChevronsUpDown class="ml-auto size-4" />
						</Sidebar.MenuButton>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content
					class="w-[--bits-dropdown-menu-anchor-width] min-w-56 rounded-lg"
					side={sidebar.isMobile ? 'bottom' : 'right'}
					align="end"
					sideOffset={4}
				>
					<DropdownMenu.Label class="p-0 font-normal">
						<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
							<ProfileAvatar profile={authState.profile} />
							<div class="grid flex-1 text-left text-sm leading-tight">
								<span class="truncate font-semibold">{authState.profile?.displayName}</span>
								<span class="truncate text-xs">{authState.user?.email}</span>
							</div>
						</div>
					</DropdownMenu.Label>
					<DropdownMenu.Separator />
					{#each groups as items, index}
						<DropdownMenu.Group>
							{#each items as item}
								<DropdownMenu.Item>
									{#snippet child({ props })}
										{@render renderItem(item, props)}
									{/snippet}
								</DropdownMenu.Item>
							{/each}
						</DropdownMenu.Group>
						{#if index !== groups.length - 1}
							<DropdownMenu.Separator />
						{/if}
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</Sidebar.MenuItem>
	</Sidebar.Menu>
{/key}
