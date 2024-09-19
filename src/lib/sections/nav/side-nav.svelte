<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { getAuthState } from '@/auth/auth-state.svelte';
	import NavItem from './nav-item.svelte';
	import type { NavItemProps } from './nav.types';
	import {
		Home,
		LineChart,
		LogIn,
		LogOut,
		Package,
		Package2,
		Settings,
		UsersRound
	} from 'lucide-svelte';

	const authState = getAuthState();
	const isAuthenticated = $derived(!!authState.session);

	let items: [NavItemProps[], NavItemProps[]] = $state([[], []]);
	$effect(() => {
		items = [
			[
				{
					label: 'Dashboard',
					action: route('/'),
					icon: Home
				},
				{
					label: 'Products',
					action: route('/'),
					icon: Package
				},
				{
					label: 'Customers',
					action: route('/'),
					icon: UsersRound
				},
				{
					label: 'Analytics',
					action: route('/'),
					icon: LineChart
				}
			],
			[
				{
					label: 'Sign In',
					action: route('/sign-in'),
					icon: LogIn,
					hidden: isAuthenticated
				},
				{
					label: 'Sign Out',
					action: () => authState.toggleOpenSignOutDialog(),
					icon: LogOut,
					hidden: !isAuthenticated
				},
				{
					label: 'Settings',
					action: route('/'),
					icon: Settings,
					hidden: !isAuthenticated
				}
			]
		];
	});
</script>

<aside class="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
	<nav class="flex flex-col items-center gap-4 px-2 py-4">
		<a
			href={route('/')}
			class="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
		>
			<Package2 class="h-4 w-4 transition-all group-hover:scale-110" />
			<span class="sr-only">Home</span>
		</a>

		{#each items[0] as item}
			<NavItem {...item} />
		{/each}
	</nav>

	<nav class="mt-auto flex flex-col items-center gap-4 px-2 py-4">
		{#each items[1] as item}
			<NavItem {...item} />
		{/each}
	</nav>
</aside>
