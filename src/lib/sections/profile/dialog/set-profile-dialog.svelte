<script lang="ts">
	import { type SetProfileSchema } from '$lib/schemas/profile/set-profile';
	import * as Dialog from '&/ui/dialog';
	import { toast } from 'svelte-sonner';
	import { type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { SetProfileForm } from '../form';

	interface Props {
		open: boolean;
		data: SuperValidated<Infer<SetProfileSchema>>;
	}
	let { open = $bindable(), data }: Props = $props();

	const handleSuccess = () => {
		open = false;
		toast.success('Profile updated');
	};
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<h1 class="text-3xl">Edit profile</h1>
		<SetProfileForm {data} onSuccess={handleSuccess} />
	</Dialog.Content>
</Dialog.Root>
