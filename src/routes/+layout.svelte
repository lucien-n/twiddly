<script>
	import { route } from '$lib/ROUTES';
	import * as Tooltip from '&/tooltip';
	import AuthContext from '@/auth/auth-context.svelte';
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
	import { Toaster } from 'svelte-sonner';
	import '../app.css';

	const { children, data } = $props();
</script>

<Toaster richColors />

<AuthContext init={{ user: data.user, session: data.session }}>
	<div class="flex w-full flex-col">
		<aside class="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
			<nav class="flex flex-col items-center gap-4 px-2 py-4">
				<a
					href={route('/')}
					class="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
				>
					<Package2 class="h-4 w-4 transition-all group-hover:scale-110" />
					<span class="sr-only">Home</span>
				</a>
				<Tooltip.Root>
					<Tooltip.Trigger asChild let:builder>
						<a
							href={route('/')}
							class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
							use:builder.action
							{...builder}
						>
							<Home class="h-5 w-5" />
							<span class="sr-only">Dashboard</span>
						</a>
					</Tooltip.Trigger>
					<Tooltip.Content side="right">Dashboard</Tooltip.Content>
				</Tooltip.Root>

				<Tooltip.Root>
					<Tooltip.Trigger asChild let:builder>
						<a
							href="##"
							class="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
							use:builder.action
							{...builder}
						>
							<Package class="h-5 w-5" />
							<span class="sr-only">Products</span>
						</a>
					</Tooltip.Trigger>
					<Tooltip.Content side="right">Products</Tooltip.Content>
				</Tooltip.Root>
				<Tooltip.Root>
					<Tooltip.Trigger asChild let:builder>
						<a
							href="##"
							class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
							use:builder.action
							{...builder}
						>
							<UsersRound class="h-5 w-5" />
							<span class="sr-only">Customers</span>
						</a>
					</Tooltip.Trigger>
					<Tooltip.Content side="right">Customers</Tooltip.Content>
				</Tooltip.Root>
				<Tooltip.Root>
					<Tooltip.Trigger asChild let:builder>
						<a
							href="##"
							class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
							use:builder.action
							{...builder}
						>
							<LineChart class="h-5 w-5" />
							<span class="sr-only">Analytics</span>
						</a>
					</Tooltip.Trigger>
					<Tooltip.Content side="right">Analytics</Tooltip.Content>
				</Tooltip.Root>
			</nav>
			<nav class="mt-auto flex flex-col items-center gap-4 px-2 py-4">
				{#if data.session}
					<Tooltip.Root>
						<Tooltip.Trigger asChild let:builder>
							<form action={route('POST /sign-out')} method="post">
								<button
									class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
									use:builder.action
									{...builder}
									type="submit"
								>
									<LogOut class="h-5 w-5" />
									<span class="sr-only">Sign Out</span>
								</button>
							</form>
						</Tooltip.Trigger>
						<Tooltip.Content side="right">Sign Out</Tooltip.Content>
					</Tooltip.Root>

					<Tooltip.Root>
						<Tooltip.Trigger asChild let:builder>
							<a
								href="##"
								class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
								use:builder.action
								{...builder}
							>
								<Settings class="h-5 w-5" />
								<span class="sr-only">Settings</span>
							</a>
						</Tooltip.Trigger>
						<Tooltip.Content side="right">Settings</Tooltip.Content>
					</Tooltip.Root>
				{:else}
					<Tooltip.Root>
						<Tooltip.Trigger asChild let:builder>
							<a
								href={route('/sign-in')}
								class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
								use:builder.action
								{...builder}
							>
								<LogIn class="h-5 w-5" />
								<span class="sr-only">Sign In</span>
							</a>
						</Tooltip.Trigger>
						<Tooltip.Content side="right">Sign In</Tooltip.Content>
					</Tooltip.Root>
				{/if}
			</nav>
		</aside>

		<div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
			{@render children()}
		</div>
	</div>
</AuthContext>
