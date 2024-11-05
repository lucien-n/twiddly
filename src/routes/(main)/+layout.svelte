<script lang="ts">
	import { AuthContext } from '#/auth';
	import { AppSidebar } from '#/nav';
	import * as Sidebar from '&/ui/sidebar';
	import '../../app.css';

	const { children, data } = $props();
</script>

<AuthContext init={{ user: data.user, session: data.session, profile: data.profile }}>
	<Sidebar.Provider>
		<AppSidebar />

		<div class="relative flex min-h-screen w-full flex-col bg-muted/40">
			{@render children()}
		</div>
	</Sidebar.Provider>
</AuthContext>
