<script>
	import { PageInfos } from '$lib/components/page-infos';
	import { route } from '$lib/ROUTES';
	import { AuthLayout, SignUpForm } from '@/auth';

	const { data } = $props();
</script>

<PageInfos title="Sign Up" description="Join Twiddly by creating your twiddler profile" />

<AuthLayout title="Sign Up" description="Fill in the information below to create an account">
	{#snippet children()}
		<SignUpForm data={data.signUpForm} />
	{/snippet}

	{#snippet footer()}
		Already have an account?
		<a href={route('/sign-in')} class="underline">Sign in</a>
	{/snippet}
</AuthLayout>
