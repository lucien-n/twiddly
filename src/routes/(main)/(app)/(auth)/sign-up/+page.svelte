<script>
	import { route } from '$lib/ROUTES';
	import { AuthLayout, SignUpForm } from '#/auth';

	const { data } = $props();
</script>

<AuthLayout title="Sign Up" description="Fill in the information below to create an account">
	{#snippet children()}
		<SignUpForm data={data.signUpForm} class="space-y-4" />
	{/snippet}

	{#snippet footer()}
		Already have an account?
		<a href={route('/sign-in')} class="underline">Sign in</a>
	{/snippet}
</AuthLayout>
