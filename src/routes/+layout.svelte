<script>
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from 'svelte-sonner';
	import '../app.css';
	import { route } from '$lib/ROUTES';
	import { toast } from 'svelte-sonner';
	import { Button } from '&/button';

	const { children } = $props();
</script>

<Toaster richColors />
<ModeWatcher />

<Button
	class="absolute"
	onclick={async () => {
		fetch(route('GET /temp/send-otp-email'))
			.then(() => toast.success('Email sent !'))
			.catch(() => toast.error("Couldn't send email"));
	}}
>
	SEND MAIL
</Button>

{@render children()}
