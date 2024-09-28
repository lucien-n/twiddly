<script lang="ts">
	import { type SetProfileSchema } from '$lib/schemas/profile/set-profile';
	import * as Dialog from '&/dialog';
	import type { Profile } from '@prisma/client';
	import { toast } from 'svelte-sonner';
	import { type Infer, type SuperValidated } from 'sveltekit-superforms';
	import SetProfileForm from './set-profile-form.svelte';

	interface Props {
		open: boolean;
		profile: Pick<Profile, 'handle'>;
		data: SuperValidated<Infer<SetProfileSchema>>;
	}
	let { open = $bindable(), profile, data }: Props = $props();

	const handleSuccess = () => {
		open = false;
		toast.success('Profile updated');
	};
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<h1 class="text-3xl">Edit profile</h1>
		<SetProfileForm {data} {profile} onSuccess={handleSuccess} />
	</Dialog.Content>
</Dialog.Root>
