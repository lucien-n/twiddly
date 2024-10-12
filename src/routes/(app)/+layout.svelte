<script>
	import { AuthContext } from '@/auth';
	import { SideNav } from '@/nav';
	import '../../app.css';
	import * as Alert from '&/alert';
	import { MailWarning } from 'lucide-svelte';
	import { Button } from '&/button';
	import { route } from '$lib/ROUTES';

	const { children, data } = $props();
</script>

<!-- todo: closeable ? -->
<Alert.Root class="absolute right-0 top-0 z-20 m-3 w-fit pb-1">
	<MailWarning class="h-4 w-4" />
	<Alert.Title>Heads up!</Alert.Title>
	<Alert.Description class="pb-0">
		You did not verified your email yet, you can verify it
		<Button variant="link" href={route('/verify')} class="px-0">here</Button>
	</Alert.Description>
</Alert.Root>

<AuthContext init={{ user: data.user, session: data.session, profile: data.profile }}>
	<div class="flex min-h-screen w-full flex-col bg-muted/40">
		<SideNav />

		<section
			class="mx-auto flex h-screen w-full flex-col overflow-hidden px-11 shadow-md sm:max-w-3xl sm:gap-4"
		>
			{@render children()}
		</section>
	</div>
</AuthContext>
