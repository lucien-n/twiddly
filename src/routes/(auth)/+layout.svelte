<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { route } from '$lib/ROUTES';
	import { fly } from 'svelte/transition';

	const { children } = $props();

	const signinRoute = route('/sign-in');
	const signupRoute = route('/sign-up');

	let current: 'register' | 'login' = $state('register');
	$effect(() => {
		current = browser
			? $page.url.pathname.startsWith(signupRoute)
				? 'register'
				: 'login'
			: 'register';
	});
</script>

<div class="h-screen w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
	<div class="hidden bg-muted lg:block">
		<img
			src="/images/placeholder.svg"
			alt="placeholder"
			width="1920"
			height="1080"
			class="h-full w-full bg-background/50 object-cover dark:brightness-[0.2] dark:grayscale"
		/>
	</div>
	{#key current}
		<div class="flex items-center justify-center py-12" in:fly={{ x: -200 }}>
			<div class="mx-auto grid w-[350px] gap-6">
				<div class="grid gap-2 text-center">
					<h1 class="text-3xl font-bold">
						{current === 'register' ? 'Sign Up' : 'Sign In'}
					</h1>
					<p class="text-balance text-muted-foreground">
						{current === 'register'
							? 'Fill in the information below to create an account'
							: 'Enter your email below to sign in to your account'}
					</p>
				</div>
				<div class="grid gap-4">
					{@render children()}
				</div>
				<div class="mt-4 text-center text-sm">
					{#if current === 'register'}
						Already have an account?
						<a href={signinRoute} class="underline"> Sign in </a>
					{:else}
						Don&apos;t have an account?
						<a href={signupRoute} class="underline"> Sign up </a>
					{/if}
				</div>
			</div>
		</div>
	{/key}
</div>
