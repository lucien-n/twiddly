<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { AuthLayout, SignInForm } from '#/auth';

	const { data } = $props();
</script>

<AuthLayout title="Sign In" description="Enter your email below to sign in to your account">
	{#snippet children()}
		<SignInForm data={data.signInForm} class="space-y-4" />
	{/snippet}

	{#snippet footer()}
		Don&apos;t have an account?
		<a href={route('/sign-up')} class="underline">Sign up</a>
	{/snippet}
</AuthLayout>
