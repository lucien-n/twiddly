<script lang="ts">
	import { DeleteAccountDialog } from '#/auth';
	import { SetPrivacySettingsForm } from '#/settings';
	import { Button } from '&/ui/button';
	import { route } from '$lib/ROUTES';
	import { dev } from '$app/environment';
	import { toast } from 'svelte-sonner';

	const { data } = $props();

	let openDeleteAccountDialog = $state(false);

	const handleRetrievePersonalInfo = async (event: Event) => {
		event.preventDefault();

		try {
			const res = await fetch(route('GET /api/v1/retrievePersonalInfo'));

			if (!res.ok) {
				toast.warning('Please try again later');
				return;
			}

			const blob = await res.blob();

			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = res.headers.get('Content-Disposition')?.split('"').at(1) ?? 'data.json';
			link.click();
		} catch (e) {
			if (dev) {
				console.error(e);
			}

			toast.error('An unexpected error occured');
		}
	};
</script>

<SetPrivacySettingsForm data={data.setSettingsForm} />

<Button onclick={handleRetrievePersonalInfo}>Retrieve personal info</Button>

<Button variant="destructive" class="mb-5 mt-auto" onclick={() => (openDeleteAccountDialog = true)}>
	Delete account
</Button>

<DeleteAccountDialog bind:open={openDeleteAccountDialog} />
