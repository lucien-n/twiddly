<script>
	import { AuthContext } from '@/auth';
	import { SideNav } from '@/nav';
	import '../../app.css';

	const { children, data } = $props();
</script>

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
