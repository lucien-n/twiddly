<script lang="ts">
	import { PageInfos } from '$lib/components/page-infos';
	import { route } from '$lib/ROUTES';
	import { AuthLayout, SignInForm } from '@/auth';

	const { data } = $props();
</script>

<PageInfos title="Sign In" description="Sign in to your Twiddly account" />

<AuthLayout title="Sign In" description="Enter your email below to sign in to your account">
	{#snippet children()}
		<SignInForm data={data.signInForm} />
	{/snippet}

	{#snippet footer()}
		Don&apos;t have an account?
		<a href={route('/sign-up')} class="underline">Sign up</a>
	{/snippet}
</AuthLayout>
