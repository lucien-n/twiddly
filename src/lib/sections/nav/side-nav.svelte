<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { getAuthState } from '@/auth/auth.state.svelte';
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

	let topItems: NavItemProps[] = $state([]);
	let bottomItems: NavItemProps[] = $state([]);
	$effect(() => {
		topItems = [
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
		];

		bottomItems = [
			{
				label: 'Sign In',
				action: route('/sign-in'),
				icon: LogIn,
				hidden: !authState.session
			},
			{
				label: 'Sign Out',
				action: () => authState.toggleOpenSignOutDialog(),
				icon: LogOut,
				hidden: !!authState.session
			},
			{
				label: 'Settings',
				action: route('/'),
				icon: Settings,
				hidden: !!authState.session
			}
		];
	});
</script>

<button onclick={() => authState.toggleOpenSignOutDialog()}>Toggle Sign Out Dialog</button>

<aside class="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
	<nav class="flex flex-col items-center gap-4 px-2 py-4">
		<a
			href={route('/')}
			class="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
		>
			<Package2 class="h-4 w-4 transition-all group-hover:scale-110" />
			<span class="sr-only">Home</span>
		</a>

		{#each topItems as item}
			<NavItem {...item} />
		{/each}
	</nav>

	<nav class="mt-auto flex flex-col items-center gap-4 px-2 py-4">
		{#each bottomItems as item}
			<NavItem {...item} />
		{/each}
	</nav>
</aside>
